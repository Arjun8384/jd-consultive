import { useState } from 'react';

export default function ResumeBuilder() {

  const API_URL =
    process.env.REACT_APP_API_URL;

  const [loading, setLoading] =
    useState(false);

  const [resume, setResume] =
    useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    objective: '',
    skills: '',
    experience: '',
    projects: '',
    education: '',
    certifications: '',
    linkedin: '',
    github: '',
    template: 'Professional',
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const generateResume = async () => {

  try {

    setLoading(true);

    const response =
      await fetch(
        `${API_URL}/api/resume/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body:
            JSON.stringify(form),
        }
      );

    const data =
      await response.json();

    setResume(
      data.resume || ''
    );

  } catch (error) {

    console.log(error);

  } finally {

    setLoading(false);
  }
};

const downloadPdf = async () => {

  try {

    const response =
      await fetch(
        `${API_URL}/api/resume/pdf`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            resume,
          }),
        }
      );

    const blob =
      await response.blob();

    const url =
      window.URL.createObjectURL(
        blob
      );

    const a =
      document.createElement('a');

    a.href = url;

    a.download =
      'resume.pdf';

    document.body.appendChild(a);

    a.click();

    a.remove();

  } catch (error) {

    console.log(error);
  }
};

  return (

    <div className="resume-page">

      <h1>
        ATS Resume Generator
      </h1>

      <p>
        Enter your details and generate
        a professional ATS-friendly resume.
      </p>

      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={form.fullName}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
      />

      <textarea
        name="objective"
        placeholder="Career Objective"
        value={form.objective}
        onChange={handleChange}
      />

      <textarea
        name="skills"
        placeholder="Skills (comma separated)"
        value={form.skills}
        onChange={handleChange}
      />

      <textarea
        name="experience"
        placeholder="Experience"
        value={form.experience}
        onChange={handleChange}
      />

      <textarea
        name="projects"
        placeholder="Projects"
        value={form.projects}
        onChange={handleChange}
      />

      <textarea
        name="education"
        placeholder="Education"
        value={form.education}
        onChange={handleChange}
      />

      <textarea
        name="certifications"
        placeholder="Certifications"
        value={form.certifications}
        onChange={handleChange}
      />

      <input
        type="text"
        name="linkedin"
        placeholder="LinkedIn URL"
        value={form.linkedin}
        onChange={handleChange}
      />

      <input
        type="text"
        name="github"
        placeholder="GitHub URL"
        value={form.github}
        onChange={handleChange}
      />

      <select
  name="template"
  value={form.template}
  onChange={handleChange}
>

  <option value="Professional">
    Professional
  </option>

  <option value="Modern">
    Modern
  </option>

  <option value="Fresher">
    Fresher
  </option>

  <option value="Executive">
    Executive
  </option>

</select>

      <button
        onClick={generateResume}
        disabled={loading}
      >
        {
          loading
            ? 'Generating...'
            : 'Generate Resume'
        }
      </button>

      {resume && (

  <div
    className="resume-preview"
  >

    <h2>
      Resume Preview
    </h2>

    <pre className='resume-content'>{resume}</pre>

    <button
      className="download-btn"
      onClick={downloadPdf}
    >
      Download PDF
    </button>

  </div>
)}

    </div>

  );
}