const express = require('express');
const PDFDocument = require('pdfkit');
const Groq = require('groq-sdk');

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/*
|--------------------------------------------------------------------------
| Generate Resume (AI)
|--------------------------------------------------------------------------
*/
router.post('/generate', async (req, res) => {
  try {

    const {
      fullName,
      email,
      phone,
      objective,
      skills,
      experience,
      projects,
      education,
      certifications,
      linkedin,
      github,
      template,
    } = req.body;

    const prompt = `
Create a highly ATS optimized ${template} resume.

Candidate Details:

Name: ${fullName}
Email: ${email}
Phone: ${phone}

Career Objective:
${objective}

Skills:
${skills}

Experience:
${experience}

Projects:
${projects}

Education:
${education}

Certifications:
${certifications}

LinkedIn:
${linkedin}

Github:
${github}

Requirements:

1. Use clean ATS format.
2. Create proper sections.
3. Improve wording professionally.
4. Use bullet points where appropriate.
5. Make resume recruiter friendly.
6. Return ONLY resume text.
7. No markdown.
8. No explanations.
`;

    const completion =
      await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

    const resume =
      completion?.choices?.[0]?.message?.content ||
      'Resume generation failed.';

    return res.json({
      success: true,
      resume,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Download Resume PDF
|--------------------------------------------------------------------------
*/
router.post('/pdf', async (req, res) => {
  try {

    const { resume } = req.body;

    const doc = new PDFDocument({
      margin: 40,
    });

    res.setHeader(
      'Content-Type',
      'application/pdf'
    );

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=resume.pdf'
    );

    doc.pipe(res);

    doc
      .fontSize(24)
      .text('ATS Resume', {
        align: 'center',
      });

    doc.moveDown();

    doc
      .fontSize(11)
      .text(
        resume,
        {
          align: 'left',
          lineGap: 4,
        }
      );

    doc.end();

  } catch (error) {

    return res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;