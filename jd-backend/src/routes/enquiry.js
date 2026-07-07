const express = require('express');
const { body, validationResult } = require('express-validator');

const ClientEnquiry = require('../models/ClientEnquiry');
const CandidateEnquiry = require('../models/CandidateEnquiry');

const { submissionLimiter } = require('../middleware/rateLimiter');
const logger = require('../config/logger');
const transporter = require('../config/mailer');
const uploadResume = require('../middleware/uploadResume');
const getBucket = require('../config/gridfs');

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                                EMAIL HELPERS                               */
/* -------------------------------------------------------------------------- */

async function notifyOwnerClient(entry) {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.OWNER_EMAIL,

    subject: `Client | ${entry.company} | ${entry.name}`,
    html: `
      <h2>New Client Requirement Received</h2>

      <p><strong>Name:</strong> ${entry.name}</p>
      <p><strong>Company:</strong> ${entry.company}</p>
      <p><strong>Email:</strong> ${entry.email}</p>
      <p><strong>Phone:</strong> ${entry.phone}</p>
      <p><strong>Service:</strong> ${entry.service}</p>

      <p><strong>Industry:</strong> ${entry.industry || '-'}</p>
      <p><strong>Positions:</strong> ${entry.positions || '-'}</p>
      <p><strong>Locations:</strong> ${entry.locations || '-'}</p>

      <hr>

      <p>${entry.message || 'No message provided'}</p>
    `,
  });
}

async function notifyOwnerCandidate(entry) {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.OWNER_EMAIL,

    subject: `Candidate | ${entry.name} | ${entry.currentCompany || "N/A"} | #${entry._id}`,
    html: `
      <h2>New Candidate Profile Received</h2>

      <p><strong>Name:</strong> ${entry.name}</p>
      <p><strong>Email:</strong> ${entry.email}</p>
      <p><strong>Phone:</strong> ${entry.phone}</p>
      <p><strong>Experience:</strong> ${entry.experience}</p>

      <p><strong>Current Title:</strong> ${entry.currentTitle || '-'}</p>
      <p><strong>Current Company:</strong> ${entry.currentCompany || '-'}</p>

      <hr>

      <p>${entry.message || 'No message provided'}</p>
    `,
  });
}

async function sendClientConfirmation(entry) {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: entry.email,

    subject: 'Requirement Received Successfully',

    html: `
      <h2>Thank You ${entry.name}</h2>

      <p>
        We have successfully received your hiring requirement.
      </p>

      <p>
        Our recruitment team will review the details
        and contact you shortly.
      </p>

      <br>

      <p>
        Regards,<br/>
        ${process.env.COMPANY_NAME}
      </p>
    `,
  });
}

async function sendCandidateConfirmation(entry) {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: entry.email,

    subject: 'Profile Received Successfully',

    html: `
      <h2>Thank You ${entry.name}</h2>

      <p>
        We have successfully received your profile.
      </p>

      <p>
        Our recruitment team will review your profile
        and reach out if a suitable opportunity matches
        your experience.
      </p>

      <br>

      <p>
        Regards,<br/>
        ${process.env.COMPANY_NAME}
      </p>
    `,
  });
}

/* -------------------------------------------------------------------------- */
/*                               VALIDATIONS                                  */
/* -------------------------------------------------------------------------- */

const clientRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .escape(),

  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company is required')
    .isLength({ max: 150 })
    .escape(),

  body('email')
    .isEmail()
    .withMessage('Valid email required')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .isLength({ max: 20 })
    .escape(),

  body('service')
    .trim()
    .notEmpty()
    .withMessage('Service is required')
    .isIn([
      'Permanent Hiring',
      'Contract Staffing',
      'Bulk Hiring',
      'Executive Search',
    ]),

  body('designation')
    .trim()
    .isLength({ max: 100 })
    .escape()
    .optional({ nullable: true }),

  body('industry')
    .trim()
    .isLength({ max: 100 })
    .escape()
    .optional({ nullable: true }),

  body('positions')
    .trim()
    .isLength({ max: 50 })
    .escape()
    .optional({ nullable: true }),

  body('locations')
    .trim()
    .isLength({ max: 200 })
    .escape()
    .optional({ nullable: true }),

  body('experience')
    .trim()
    .isLength({ max: 50 })
    .escape()
    .optional({ nullable: true }),

  body('message')
    .trim()
    .isLength({ max: 2000 })
    .escape()
    .optional({ nullable: true }),
];

const candidateRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .escape(),

  body('email')
    .isEmail()
    .withMessage('Valid email required')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .isLength({ max: 20 })
    .escape(),

  body('experience')
    .trim()
    .notEmpty()
    .withMessage('Experience is required')
    .isIn([
      'Fresher / 0–1 yr',
      '1–3 years',
      '3–5 years',
      '5–8 years',
      '8+ years',
    ]),

  body('currentTitle')
    .trim()
    .isLength({ max: 100 })
    .escape()
    .optional({ nullable: true }),

  body('currentCompany')
    .trim()
    .isLength({ max: 150 })
    .escape()
    .optional({ nullable: true }),

  body('domain')
    .trim()
    .isLength({ max: 100 })
    .escape()
    .optional({ nullable: true }),

  body('noticePeriod')
    .trim()
    .isLength({ max: 50 })
    .escape()
    .optional({ nullable: true }),

  body('currentCTC')
    .trim()
    .isLength({ max: 30 })
    .escape()
    .optional({ nullable: true }),

  body('expectedCTC')
    .trim()
    .isLength({ max: 30 })
    .escape()
    .optional({ nullable: true }),

  body('locations')
    .trim()
    .isLength({ max: 200 })
    .escape()
    .optional({ nullable: true }),

  body('message')
    .trim()
    .isLength({ max: 2000 })
    .escape()
    .optional({ nullable: true }),
];

/* -------------------------------------------------------------------------- */
/*                               CLIENT ROUTE                                 */
/* -------------------------------------------------------------------------- */

router.post(
  '/client',
  submissionLimiter,
  clientRules,

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    try {
      const entry = await ClientEnquiry.create({
        ...req.body,
        ip: req.ip,
      });

      try {
        await Promise.all([
          notifyOwnerClient(entry),
          sendClientConfirmation(entry),
        ]);
      } catch (mailError) {
        logger.error(
          `Client email failed: ${mailError.message}`
        );
      }

      logger.info(
        `[CLIENT ENQUIRY] id=${entry._id} company="${entry.company}" email=${entry.email}`
      );

      return res.status(201).json({
        success: true,
        id: entry._id,
      });

    } catch (err) {

      logger.error(
        `Client enquiry save failed: ${err.message}`
      );

      return res.status(500).json({
        error:
          'Could not save your enquiry. Please try again.',
      });
    }
  }
);

/* -------------------------------------------------------------------------- */
/*                             CANDIDATE ROUTE                                */
/* -------------------------------------------------------------------------- */

router.post(
  '/candidate',
  submissionLimiter,
  uploadResume.single('resume'),
  candidateRules,

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    try {
      let resumeFileId = "";
let resumeOriginalName = "";
let resumeMimeType = "";

if (req.file) {
  console.log("Bucket:", getBucket());

  const bucket = getBucket();

  const uploadStream = bucket.openUploadStream(
    req.file.originalname,
    {
      contentType: req.file.mimetype,
    }
  );

  await new Promise((resolve, reject) => {

    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", () => {

      resumeFileId = uploadStream.id.toString();
      console.log("Uploaded File ID:", resumeFileId);

      resumeOriginalName = req.file.originalname;

      resumeMimeType = req.file.mimetype;

      resolve();

    });

    uploadStream.on("error", reject);

  });

}

      const entry = await CandidateEnquiry.create({

  ...req.body,

  ip: req.ip,

  resumeFileId,
  resumeOriginalName,
  resumeMimeType,

});

      try {
        await Promise.all([
          notifyOwnerCandidate(entry),
          sendCandidateConfirmation(entry),
        ]);
      } catch (mailError) {
        logger.error(
          `Candidate email failed: ${mailError.message}`
        );
      }

      logger.info(
        `[CANDIDATE ENQUIRY] id=${entry._id} name="${entry.name}" email=${entry.email}`
      );

      return res.status(201).json({
        success: true,
        id: entry._id,
      });

    } catch (err) {

      logger.error(
        `Candidate enquiry save failed: ${err.message}`
      );

      return res.status(500).json({
        error:
          'Could not save your profile. Please try again.',
      });
    }
  }
);

module.exports = router;