const express   = require('express');
const { body, query } = require('express-validator');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const mongoose   = require('mongoose');
const ClientEnquiry    = require('../models/ClientEnquiry');
const CandidateEnquiry = require('../models/CandidateEnquiry');
const requireAuth      = require('../middleware/auth');
// const { loginLimiter } = require('../middleware/rateLimiter');
const logger = require('../config/logger');
const Admin = require('../models/Admin');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const router = express.Router();
const loginProtection = require('../middleware/loginProtection');
const getBucket = require('../config/gridfs');
const { ObjectId } = require("mongodb");

function verifyExportToken(
  req,
  res,
  next
) {

  const token =
    req.query.token;

  if (!token) {

    return res.status(401)
      .json({
        error:
          'No token',
      });
  }

  try {

    jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    next();

  } catch {

    return res.status(401)
      .json({
        error:
          'Invalid token',
      });
  }
}

router.post('/setup', async (req, res) => {

  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      error: 'Setup route disabled',
    });
  }

  try {

    const { username, password } = req.body;

    const existingAdmin =
      await Admin.findOne();

    if (existingAdmin) {
      return res.status(400).json({
        error: 'Admin already exists',
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 12);

    const admin =
      await Admin.create({
        username,
        password: hashedPassword,
      });

    return res.json({
      success: true,
      admin: {
        username: admin.username,
      },
    });

  } catch (error) {

    return res.status(500).json({
      error: error.message,
    });
  }
});

// ── POST /api/admin/login ──────────────────────────────────────────────────────
router.post('/login', loginProtection, async (req, res) => {

  try {

    console.log('BODY:', req.body);

    const admin = await Admin.findOne({
      username: req.body.username,
    });

    console.log('ADMIN:', admin);

    if (!admin) {

      return res.status(401).json({
        error: 'Admin not found',
      });
    }

    const match = await bcrypt.compare(
      req.body.password,
      admin.password
    );

    console.log('MATCH:', match);

    if (!match) {

      return res.status(401).json({
        error: 'Invalid password',
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '8h',
      }
    );

    return res.json({
      token,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      error: error.message,
    });
  }
});

// password change route
router.patch('/change-password', requireAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const admin = await Admin.findOne();

    const valid = await bcrypt.compare(
      oldPassword,
      admin.password
    );

    if (!valid) {
      return res.status(401).json({
        error: 'Old password incorrect',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    admin.password = hashedPassword;

    await admin.save();

    return res.json({
      success: true,
      message: 'Password updated successfully',
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

router.patch('/change-credentials', requireAuth, async (req, res) => {

  try {

    const {
      currentPassword,
      newUsername,
      newPassword,
    } = req.body;

    const admin = await Admin.findOne();

    if (!admin) {
      return res.status(404).json({
        error: 'Admin not found',
      });
    }

    const validPassword = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!validPassword) {
      return res.status(401).json({
        error: 'Current password incorrect',
      });
    }

    if (newUsername) {
      admin.username = newUsername;
    }

    if (newPassword) {

      const hashedPassword = await bcrypt.hash(
        newPassword,
        12
      );

      admin.password = hashedPassword;
    }

    await admin.save();

    return res.json({
      success: true,
      message: 'Credentials updated successfully',
    });

  } catch (error) {

    return res.status(500).json({
      error: error.message,
    });
  }
});

// ── GET /api/admin/stats ───────────────────────────────────────────────────────
router.get('/stats', requireAuth, async (req, res) => {
  const [totalClients, totalCandidates, newClients, newCandidates] = await Promise.all([
    ClientEnquiry.countDocuments(),
    CandidateEnquiry.countDocuments(),
    ClientEnquiry.countDocuments({ status: 'new' }),
    CandidateEnquiry.countDocuments({ status: 'new' }),
  ]);

  return res.json({
    clients:    { total: totalClients,    unread: newClients },
    candidates: { total: totalCandidates, unread: newCandidates },
  });
});

// ── GET /api/admin/clients ─────────────────────────────────────────────────────
router.get('/clients', requireAuth, [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(['new', 'contacted', 'closed']),
  query('search').optional().isString().trim().isLength({ max: 100 }),
], async (req, res) => {
  const page   = req.query.page   || 1;
  const limit  = req.query.limit  || 20;
  const skip   = (page - 1) * limit;
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    const re = new RegExp(req.query.search, 'i');
    filter.$or = [{ name: re }, { company: re }, { email: re }];
  }

  const [data, total] = await Promise.all([
    ClientEnquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ClientEnquiry.countDocuments(filter),
  ]);

  return res.json({ total, page, pages: Math.ceil(total / limit), data });
});

// ── GET /api/admin/candidates ──────────────────────────────────────────────────
router.get('/candidates', requireAuth, [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(['new', 'reviewed', 'shortlisted', 'rejected']),
  query('search').optional().isString().trim().isLength({ max: 100 }),
], async (req, res) => {
  const page   = req.query.page   || 1;
  const limit  = req.query.limit  || 20;
  const skip   = (page - 1) * limit;
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    const re = new RegExp(req.query.search, 'i');
    filter.$or = [{ name: re }, { email: re }, { currentCompany: re }];
  }

  const [data, total] = await Promise.all([
    CandidateEnquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    CandidateEnquiry.countDocuments(filter),
  ]);

  return res.json({ total, page, pages: Math.ceil(total / limit), data });
});

router.get(
  "/candidates/:id/resume",
  requireAuth,
  async (req, res) => {

    try {

      const candidate =
        await CandidateEnquiry.findById(
          req.params.id
        );

      if (!candidate) {

        return res.status(404).json({
          error: "Candidate not found"
        });

      }

      if (!candidate.resumeFileId) {

        return res.status(404).json({
          error: "Resume not found"
        });

      }

      const bucket = getBucket();

      const downloadStream =
        bucket.openDownloadStream(
          new mongoose.Types.ObjectId(
            candidate.resumeFileId
          )
        );

      res.set(
        "Content-Type",
        candidate.resumeMimeType ||
        "application/pdf"
      );

      res.set(
        "Content-Disposition",
        `inline; filename="${candidate.resumeOriginalName}"`
      );

      downloadStream.pipe(res);

      downloadStream.on(
        "error",
        () => {

          return res.status(404).json({
            error: "Resume not found"
          });

        }
      );

    } catch (error) {

      return res.status(500).json({
        error: error.message
      });

    }

  }
);

router.get(
  "/resume/:fileId",
  requireAuth,
  async (req, res) => {

    try {

      const bucket = getBucket();

      const fileId =
        new ObjectId(req.params.fileId);

      const files =
        await bucket.find({
          _id: fileId,
        }).toArray();

      if (!files.length) {

        return res.status(404).json({
          error: "Resume not found",
        });

      }

      res.set(
        "Content-Type",
        files[0].contentType || "application/pdf"
      );

      res.set(
        "Content-Disposition",
        `inline; filename="${files[0].filename}"`
      );

      bucket
        .openDownloadStream(fileId)
        .pipe(res);

    }

    catch (error) {

      console.log(error);

      res.status(500).json({
        error: error.message,
      });

    }

  }
);


// ── GET /api/admin/:type/:id ───────────────────────────────────────────────────
router.get('/:type/:id', requireAuth, async (req, res) => {
  const { type, id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });

  const Model = type === 'clients' ? ClientEnquiry : type === 'candidates' ? CandidateEnquiry : null;
  if (!Model) return res.status(400).json({ error: 'Invalid type. Use clients or candidates.' });

  const entry = await Model.findById(id).lean();
  if (!entry) return res.status(404).json({ error: 'Entry not found' });

  return res.json(entry);
});

// ── PATCH /api/admin/:type/:id/status ─────────────────────────────────────────
router.patch('/:type/:id/status', requireAuth,
  [body('status').notEmpty().isString()],
  async (req, res) => {
    const { type, id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });

    const Model = type === 'clients' ? ClientEnquiry : type === 'candidates' ? CandidateEnquiry : null;
    if (!Model) return res.status(400).json({ error: 'Invalid type' });

    const entry = await Model.findByIdAndUpdate(
      id,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).lean();

    if (!entry) return res.status(404).json({ error: 'Entry not found' });

    logger.info(`[ADMIN] Status updated: ${type}/${id} → ${req.body.status}`);
    return res.json({ success: true, entry });
  }
);

// ── DELETE /api/admin/:type/:id ────────────────────────────────────────────────
router.delete('/:type/:id', requireAuth, async (req, res) => {
  const { type, id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });

  const Model = type === 'clients' ? ClientEnquiry : type === 'candidates' ? CandidateEnquiry : null;
  if (!Model) return res.status(400).json({ error: 'Invalid type' });

  const result = await Model.findByIdAndDelete(id);
  if (!result) return res.status(404).json({ error: 'Entry not found' });

  logger.info(`[ADMIN] Deleted: ${type}/${id}`);
  return res.json({ success: true });
});

// ── GET /api/admin/export/all ──────────────────────────────────────────────────
router.get('/export/all', requireAuth, async (req, res) => {
  const [clients, candidates] = await Promise.all([
    ClientEnquiry.find().sort({ createdAt: -1 }).lean(),
    CandidateEnquiry.find().sort({ createdAt: -1 }).lean(),
  ]);

  logger.info(`[ADMIN] Full data export triggered from IP: ${req.ip}`);

  res.setHeader('Content-Disposition', `attachment; filename="jd_export_${Date.now()}.json"`);
  res.setHeader('Content-Type', 'application/json');
  return res.json({
    exportedAt:      new Date().toISOString(),
    totalClients:    clients.length,
    totalCandidates: candidates.length,
    clients,
    candidates,
  });
});


router.get(
  '/export/clients/xls',
  requireAuth,
  async (req, res) => {

    const clients =
      await ClientEnquiry
        .find()
        .sort({ createdAt: -1 })
        .lean();

    const workbook =
      new ExcelJS.Workbook();

    const sheet =
      workbook.addWorksheet(
        'Clients'
      );

    sheet.columns = [
      {
        header: 'Name',
        key: 'name',
        width: 25
      },
      {
        header: 'Company',
        key: 'company',
        width: 25
      },
      {
        header: 'Email',
        key: 'email',
        width: 30
      },
      {
        header: 'Phone',
        key: 'phone',
        width: 20
      },
      {
        header: 'Service',
        key: 'service',
        width: 25
      },
      {
        header: 'Status',
        key: 'status',
        width: 20
      }
    ];

    clients.forEach((client) => {

      sheet.addRow({
        name: client.name,
        company: client.company,
        email: client.email,
        phone: client.phone,
        service: client.service,
        status: client.status
      });

    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=clients.xlsx'
    );

    await workbook.xlsx.write(res);

    res.end();

  }
);

router.get(
  '/export/candidates/xls',
  requireAuth,
  async (req, res) => {

    const candidates =
      await CandidateEnquiry
        .find()
        .sort({ createdAt: -1 })
        .lean();

    const workbook =
      new ExcelJS.Workbook();

    const sheet =
      workbook.addWorksheet(
        'Candidates'
      );

    sheet.columns = [
      {
        header: 'Name',
        key: 'name',
        width: 25
      },
      {
        header: 'Email',
        key: 'email',
        width: 30
      },
      {
        header: 'Phone',
        key: 'phone',
        width: 20
      },
      {
        header: 'Experience',
        key: 'experience',
        width: 20
      },
      {
        header: 'Company',
        key: 'company',
        width: 25
      },
      {
        header: 'Status',
        key: 'status',
        width: 20
      }
    ];

    candidates.forEach((candidate) => {

      sheet.addRow({
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        experience: candidate.experience,
        company:
          candidate.currentCompany,
        status: candidate.status
      });

    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=candidates.xlsx'
    );

    await workbook.xlsx.write(res);

    res.end();

  }
);

router.get(
  '/export/clients/pdf',
  requireAuth,
  async (req, res) => {

    try {

      const clients =
        await ClientEnquiry.find()
        .sort({ createdAt: -1 });

      const doc =
        new PDFDocument({
          margin: 40,
        });

      res.setHeader(
        'Content-Type',
        'application/pdf'
      );

      res.setHeader(
        'Content-Disposition',
        'attachment; filename=clients-report.pdf'
      );

      doc.pipe(res);

      doc
        .fontSize(20)
        .text(
          'JD Consultive - Client Enquiries'
        );

      doc.moveDown();

      clients.forEach((client, index) => {

        doc
          .fontSize(12)
          .text(
            `${index + 1}. ${client.name}`
          );

        doc.text(
          `Company: ${client.company}`
        );

        doc.text(
          `Email: ${client.email}`
        );

        doc.text(
          `Phone: ${client.phone}`
        );

        doc.text(
          `Service: ${client.service}`
        );

        doc.text(
          `Status: ${client.status}`
        );

        doc.text(
          `Date: ${new Date(
            client.createdAt
          ).toLocaleDateString()}`
        );

        doc.moveDown();
      });

      doc.end();

    } catch (error) {

      return res
        .status(500)
        .json({
          error:
            error.message,
        });
    }
  }
);

router.get(
  '/export/candidates/pdf',
    requireAuth,
  async (req, res) => {

    try {

      const candidates =
        await CandidateEnquiry.find()
        .sort({ createdAt: -1 });

      const doc =
        new PDFDocument({
          margin: 40,
        });

      res.setHeader(
        'Content-Type',
        'application/pdf'
      );

      res.setHeader(
        'Content-Disposition',
        'attachment; filename=candidates-report.pdf'
      );

      doc.pipe(res);

      doc
        .fontSize(20)
        .text(
          'JD Consultive - Candidate Enquiries'
        );

      doc.moveDown();

      candidates.forEach(
        (
          candidate,
          index
        ) => {

          doc
            .fontSize(12)
            .text(
              `${index + 1}. ${candidate.name}`
            );

          doc.text(
            `Email: ${candidate.email}`
          );

          doc.text(
            `Phone: ${candidate.phone}`
          );

          doc.text(
            `Experience: ${candidate.experience}`
          );

          doc.text(
            `Current Company: ${candidate.currentCompany || '-'}`
          );

          doc.text(
            `Status: ${candidate.status}`
          );

          doc.text(
            `Date: ${new Date(
              candidate.createdAt
            ).toLocaleDateString()}`
          );

          doc.moveDown();
        }
      );

      doc.end();

    } catch (error) {

      return res
        .status(500)
        .json({
          error:
            error.message,
        });
    }
  }
);

router.get(
  '/candidates/:id',
  requireAuth,
  async (req, res) => {

    try {

      const candidate =
        await CandidateEnquiry.findById(
          req.params.id
        );

      if (!candidate) {

        return res
          .status(404)
          .json({
            error:
              'Candidate not found'
          });
      }

      return res.json(
        candidate
      );

    } catch (error) {

      return res
        .status(500)
        .json({
          error:
            error.message
        });
    }
  }
);

module.exports = router;
