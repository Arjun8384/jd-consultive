import { useState } from 'react';
import PropTypes from 'prop-types';
import useReveal from '../hooks/useReveal';
import '../styles/ContactPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// ─────────────────────────────────────────────────────────────────────────────
// FormField — defined at MODULE level (outside all components).
// This is the fix for:
//   (a) "one letter at a time" bug — defining inside a component recreates the
//       component type on every render, unmounting the input and losing focus.
//   (b) "Move this component definition out of the parent" warning.
//   (c) "A form label must be associated with a control" — htmlFor + id used.
//   (d) prop-types warnings — PropTypes defined below the component.
// ─────────────────────────────────────────────────────────────────────────────
function FormField({ label, fieldId, required=false, error='', children }) {
  return (
    <div className={`form-field${error ? ' error' : ''}`}>
      <label htmlFor={fieldId}>
        {label}
        {required && <span className="req"> *</span>}
      </label>
      {children}
      {error && <span className="err-msg">{error}</span>}
    </div>
  );
}

FormField.propTypes = {
  label:    PropTypes.string.isRequired,
  fieldId:  PropTypes.string.isRequired,
  required: PropTypes.bool,
  error:    PropTypes.string,
  children: PropTypes.node.isRequired,
};


// ─────────────────────────────────────────────────────────────────────────────
// ClientForm
// ─────────────────────────────────────────────────────────────────────────────
const CLIENT_INIT = {
  name: '', company: '', designation: '', email: '', phone: '',
  service: '', industry: '', positions: '', locations: '', experience: '', message: '',
};

function ClientForm({ onSuccess }) {
  const [form,    setForm]    = useState(CLIENT_INIT);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const clearErr = (key)      => setErrors(e => ({ ...e, [key]: '' }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Required';
    if (!form.company.trim()) e.company = 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim())   e.phone   = 'Required';
    if (!form.service)        e.service = 'Required';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/enquiry/client`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...form, type: 'client' }),
      });
      if (res.ok) onSuccess();
      else throw new Error('Server error');
    } catch {
      alert('Something went wrong. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-body">
      <p className="form-section-title">🏢 Company Details</p>

      <div className="field-row">
        <FormField label="Your Name" fieldId="cl-name" required error={errors.name}>
          <input
            id="cl-name" type="text" value={form.name} placeholder="Your Name"
            onChange={e => { setField('name', e.target.value); clearErr('name'); }}
          />
        </FormField>
        <FormField label="Company Name" fieldId="cl-company" required error={errors.company}>
          <input
            id="cl-company" type="text" value={form.company} placeholder="Company Name"
            onChange={e => { setField('company', e.target.value); clearErr('company'); }}
          />
        </FormField>
      </div>

      <div className="field-row">
        <FormField label="Your Designation" fieldId="cl-designation">
          <input
            id="cl-designation" type="text" value={form.designation} placeholder="e.g. HR Manager"
            onChange={e => setField('designation', e.target.value)}
          />
        </FormField>
        <FormField label="Email Address" fieldId="cl-email" required error={errors.email}>
          <input
            id="cl-email" type="email" value={form.email} placeholder="you@company.com"
            onChange={e => { setField('email', e.target.value); clearErr('email'); }}
          />
        </FormField>
      </div>

      <div className="field-row">
        <FormField label="Phone / WhatsApp" fieldId="cl-phone" required error={errors.phone}>
          <input
            id="cl-phone" type="tel" value={form.phone} placeholder="+91 XXXXXXXXXX"
            onChange={e => { setField('phone', e.target.value); clearErr('phone'); }}
          />
        </FormField>
        <FormField label="Service Required" fieldId="cl-service" required error={errors.service}>
          <select
            id="cl-service" value={form.service}
            onChange={e => { setField('service', e.target.value); clearErr('service'); }}
          >
            <option value="">Select a service</option>
            <option>Permanent Hiring</option>
            <option>Contract Staffing</option>
            <option>Bulk Hiring</option>
            <option>Executive Search</option>
          </select>
        </FormField>
      </div>

      <p className="form-section-title" style={{ marginTop: 8 }}>📋 Hiring Requirement</p>

      <div className="field-row">
        <FormField label="Industry / Domain" fieldId="cl-industry">
          <select id="cl-industry" value={form.industry} onChange={e => setField('industry', e.target.value)}>
            <option value="">Select industry</option>
            <option>IT / Technology</option>
            <option>BPO / Call Centre</option>
            <option>Sales &amp; Marketing</option>
            <option>HR &amp; Admin</option>
            <option>Finance &amp; Accounts</option>
            <option>Startup / Product</option>
            <option>Manufacturing</option>
            <option>Other</option>
          </select>
        </FormField>
        <FormField label="Number of Positions" fieldId="cl-positions">
          <input
            id="cl-positions" type="text" value={form.positions} placeholder="e.g. 5"
            onChange={e => setField('positions', e.target.value)}
          />
        </FormField>
      </div>

      <div className="field-row">
        <FormField label="Preferred Location(s)" fieldId="cl-locations">
          <input
            id="cl-locations" type="text" value={form.locations} placeholder="e.g. Delhi, Mumbai"
            onChange={e => setField('locations', e.target.value)}
          />
        </FormField>
        <FormField label="Experience Required" fieldId="cl-experience">
          <select id="cl-experience" value={form.experience} onChange={e => setField('experience', e.target.value)}>
            <option value="">Select experience range</option>
            <option>Fresher / 0–1 yr</option>
            <option>1–3 years</option>
            <option>3–5 years</option>
            <option>5–8 years</option>
            <option>8+ years (Senior)</option>
          </select>
        </FormField>
      </div>

      <FormField label="Detailed Requirement" fieldId="cl-message">
        <textarea
          id="cl-message" value={form.message}
          placeholder="Describe the roles, key responsibilities, skills needed, timeline, budget range, etc."
          style={{ minHeight: 130 }}
          onChange={e => setField('message', e.target.value)}
        />
      </FormField>

      <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Submitting…' : 'Submit Hiring Requirement →'}
      </button>
    </div>
  );
}

ClientForm.propTypes = { onSuccess: PropTypes.func.isRequired };

// ─────────────────────────────────────────────────────────────────────────────
// CandidateForm
// ─────────────────────────────────────────────────────────────────────────────
const CANDIDATE_INIT = {
  name: '', email: '', phone: '', currentTitle: '',
  currentCompany: '', experience: '', domain: '',
  currentCTC: '', expectedCTC: '', noticePeriod: '', locations: '', message: '',
};

function CandidateForm({ onSuccess }) {
  const [form,    setForm]    = useState(CANDIDATE_INIT);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const clearErr = (key)      => setErrors(e => ({ ...e, [key]: '' }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name       = 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim())   e.phone      = 'Required';
    if (!form.experience)     e.experience = 'Required';
    return e;
  };

  const handleSubmit = async () => {

  const e = validate();

  if (
    Object.keys(e).length
  ) {
    setErrors(e);
    return;
  }

  setLoading(true);

  try {

    const formData =
      new FormData();

    Object.entries(form)
      .forEach(
        ([key, value]) => {

          formData.append(
            key,
            value
          );

        }
      );

    if (resume) {

      formData.append(
        'resume',
        resume
      );

    }

    formData.append(
      'type',
      'candidate'
    );

    const res =
      await fetch(
        `${API_URL}/api/enquiry/candidate`,
        {
          method: 'POST',
          body: formData,
        }
      );

    const data = await res.json();

console.log('SERVER Response', data);

if (!res.ok) {
alert(
  JSON.stringify(data, null, 2));
  return;
} onSuccess();

  } catch {

    alert(
      'Something went wrong. Please try again or email us directly.'
    );

  } finally {

    setLoading(false);

  }

};

  return (
    <div className="form-body">
      <p className="form-section-title">👤 Personal Details</p>

      <div className="field-row">
        <FormField label="Full Name" fieldId="ca-name" required error={errors.name}>
          <input
            id="ca-name" type="text" value={form.name} placeholder="Full Name"
            onChange={e => { setField('name', e.target.value); clearErr('name'); }}
          />
        </FormField>
        <FormField label="Email Address" fieldId="ca-email" required error={errors.email}>
          <input
            id="ca-email" type="email" value={form.email} placeholder="you@email.com"
            onChange={e => { setField('email', e.target.value); clearErr('email'); }}
          />
        </FormField>
      </div>

      <div className="field-row">
        <FormField label="Phone / WhatsApp" fieldId="ca-phone" required error={errors.phone}>
          <input
            id="ca-phone" type="tel" value={form.phone} placeholder="+91 XXXXXXXXXX"
            onChange={e => { setField('phone', e.target.value); clearErr('phone'); }}
          />
        </FormField>
        <FormField label="Total Experience" fieldId="ca-experience" required error={errors.experience}>
          <select
            id="ca-experience" value={form.experience}
            onChange={e => { setField('experience', e.target.value); clearErr('experience'); }}
          >
            <option value="">Select experience</option>
            <option>Fresher / 0–1 yr</option>
            <option>1–3 years</option>
            <option>3–5 years</option>
            <option>5–8 years</option>
            <option>8+ years</option>
          </select>
        </FormField>
      </div>

      <p className="form-section-title" style={{ marginTop: 8 }}>💼 Professional Details</p>

      <div className="field-row">
        <FormField label="Current Job Title" fieldId="ca-title">
          <input
            id="ca-title" type="text" value={form.currentTitle} placeholder="e.g. Software Engineer"
            onChange={e => setField('currentTitle', e.target.value)}
          />
        </FormField>
        <FormField label="Current Company" fieldId="ca-company">
          <input
            id="ca-company" type="text" value={form.currentCompany} placeholder="Company name"
            onChange={e => setField('currentCompany', e.target.value)}
          />
        </FormField>
      </div>

      <div className="field-row">
        <FormField label="Domain / Function" fieldId="ca-domain">
          <select id="ca-domain" value={form.domain} onChange={e => setField('domain', e.target.value)}>
            <option value="">Select domain</option>
            <option>IT / Software</option>
            <option>BPO / Customer Support</option>
            <option>Sales &amp; Marketing</option>
            <option>HR &amp; Administration</option>
            <option>Finance &amp; Accounts</option>
            <option>Operations</option>
            <option>Other</option>
          </select>
        </FormField>
        <FormField label="Notice Period" fieldId="ca-notice">
          <select id="ca-notice" value={form.noticePeriod} onChange={e => setField('noticePeriod', e.target.value)}>
            <option value="">Select notice period</option>
            <option>Immediate / Serving Notice</option>
            <option>15 Days</option>
            <option>30 Days</option>
            <option>60 Days</option>
            <option>90 Days</option>
          </select>
        </FormField>
      </div>

      <div className="field-row">
        <FormField label="Current CTC (LPA)" fieldId="ca-ctc-current">
          <input
            id="ca-ctc-current" type="text" value={form.currentCTC} placeholder="e.g. 4.5"
            onChange={e => setField('currentCTC', e.target.value)}
          />
        </FormField>
        <FormField label="Expected CTC (LPA)" fieldId="ca-ctc-expected">
          <input
            id="ca-ctc-expected" type="text" value={form.expectedCTC} placeholder="e.g. 6"
            onChange={e => setField('expectedCTC', e.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Preferred Work Location(s)" fieldId="ca-locations">
        <input
          id="ca-locations" type="text" value={form.locations} placeholder="e.g. Delhi, Remote"
          onChange={e => setField('locations', e.target.value)}
        />
      </FormField>

      <FormField label="Anything else you'd like us to know" fieldId="ca-message">
        <textarea
          id="ca-message" value={form.message}
          placeholder="Share your career goals, key skills, preferred roles, or any other relevant details."
          onChange={e => setField('message', e.target.value)}
        />
      </FormField>

      <label>
  Resume
</label>

<input
  type="file"
  accept=".pdf,.doc,.docx"
  onChange={(e)=>
    setResume(
      e.target.files[0]
    )
  }
/>

      <button className="submit-btn submit-btn-green" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Submitting…' : 'Submit My Profile →'}
      </button>
    </div>
  );
}

CandidateForm.propTypes = { onSuccess: PropTypes.func.isRequired };

// ─────────────────────────────────────────────────────────────────────────────
// FormPanel — header + active form
// ─────────────────────────────────────────────────────────────────────────────
function FormPanel({ mode, onBack, onSuccess }) {
  const isClient = mode === 'client';
  const title    = isClient ? '🏢 Hiring Requirement' : '👤 Job Seeker Profile';
  const subtitle = isClient
    ? 'Fill in your hiring details and our team will reach out within 24 hours.'
    : "Share your details and we'll match you with relevant opportunities.";

  return (
    <div>
      <div className="form-header">
        <button className="back-link" onClick={onBack}>← Back</button>
        <h2>{title}</h2>
        <p className="form-subtitle">{subtitle}</p>
      </div>
      {isClient
        ? <ClientForm onSuccess={onSuccess} />
        : <CandidateForm onSuccess={onSuccess} />}
    </div>
  );
}

FormPanel.propTypes = {
  mode:      PropTypes.string.isRequired,
  onBack:    PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

// ─────────────────────────────────────────────────────────────────────────────
// renderFormArea — plain function (not a component) that returns JSX.
// This is the fix for the nested ternary warning.
// Instead of:  {success ? ... : mode === null ? ... : ...}
// We compute the result in a variable BEFORE the return, so the JSX
// just reads {formContent} — a single expression, zero ternary nesting.
// ─────────────────────────────────────────────────────────────────────────────
function resolveFormContent({ success, mode, onReset, onSelectMode, onSuccess }) {
  if (success) {
    return (
      <div className="success-state">
        <div className="success-icon">✅</div>
        <h2>Submission Received!</h2>
        <p>Thank you for reaching out. Our team will review your details and get back to you within 24 hours.</p>
        <button className="back-btn" onClick={onReset}>← Submit another enquiry</button>
      </div>
    );
  }

  if (mode === null) {
    return (
      <div className="mode-select">
        <h2>I am a…</h2>
        <p className="mode-sub">Select your profile to proceed with the right form.</p>
        <div className="mode-cards">
          <button className="mode-card" onClick={() => onSelectMode('client')}>
            <span className="mode-icon">🏢</span>
            <strong>Client</strong>
            <span>Looking to hire talent for my organisation</span>
            <span className="mode-arrow">→</span>
          </button>
          <button className="mode-card mode-card-green" onClick={() => onSelectMode('candidate')}>
            <span className="mode-icon">👤</span>
            <strong>Candidate</strong>
            <span>Looking for a new job opportunity</span>
            <span className="mode-arrow">→</span>
          </button>
        </div>
      </div>
    );
  }

  return <FormPanel mode={mode} onBack={onReset} onSuccess={onSuccess} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// ContactPage — main export
// ─────────────────────────────────────────────────────────────────────────────
const INFO_ROWS = [
  { icon: '📞', label: 'Phone / WhatsApp', val: '+91 7296029277',              sub: 'Mon–Sat, 9 AM – 6 PM' },
  { icon: '📧', label: 'Email',            val: 'hr.jdhirings@gmail.com',       sub: 'Response within 24 hours' },
  { icon: '📍', label: 'Coverage',         val: 'Pan India',             sub: 'All major cities & remote' },
  { icon: '🏭', label: 'Specialisation',   val: 'IT · BPO · Corporate · Startups', sub: '' },
];

export default function ContactPage() {
  const pageRef = useReveal();
  const [mode,    setMode]    = useState(null);
  const [success, setSuccess] = useState(false);

  const handleReset     = () => { setMode(null); setSuccess(false); };
  const handleSelectMode = (m) => setMode(m);
  const handleSuccess   = () => setSuccess(true);

  // Resolved before return — no nested ternary in JSX at all
  const formContent = resolveFormContent({
    success,
    mode,
    onReset:      handleReset,
    onSelectMode: handleSelectMode,
    onSuccess:    handleSuccess,
  });

  return (
    <main ref={pageRef}>
      {/* HERO */}
      <div className="contact-hero">
        <div className="contact-glow-a" aria-hidden="true" />
        <div className="contact-glow-b" aria-hidden="true" />
        <div className="container contact-hero-inner">
          <div className="sec-label reveal">Get in touch</div>
          <h1 className="contact-h1 reveal">
            How can we <span className="grad">help you?</span>
          </h1>
          <p className="contact-sub reveal">
            Whether you&apos;re building a team or looking for your next opportunity — we&apos;ve got you covered.
          </p>
        </div>
      </div>

      <div className="container contact-layout">
        {/* LEFT — contact info */}
        <aside className="contact-info reveal reveal-delay-1">
          <div className="info-card">
            <h3>Reach us directly</h3>
            {INFO_ROWS.map(({ icon, label, val, sub }) => (
              <div key={label} className="info-row">
                <div className="info-icon" aria-hidden="true">{icon}</div>
                <div>
                  <strong>{label}</strong>
                  <span>{val}</span>
                  {sub && <span className="info-sub">{sub}</span>}
                </div>
              </div>
            ))}

            <div className="social-row" style={{ marginTop: 20 }}>
              <a className="soc" href="https://wa.me/+917296029277" target="_blank" rel="noreferrer" aria-label="WhatsApp">💬</a>
              <a className="soc" href="mailto:jdconsultive@gmail.com" aria-label="Email us">✉️</a>
              <a className="soc" href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">🔗</a>
              {/* Camera/gallery: using a button since there's no URL yet — avoids the invalid href warning */}
              <button className="soc" type="button" aria-label="Gallery — coming soon" title="Gallery coming soon">📷</button>
            </div>
          </div>
        </aside>

        {/* RIGHT — form area (variable, not inline ternary) */}
        <section className="contact-form-area reveal reveal-delay-2" aria-label="Contact form">
          {formContent}
        </section>
      </div>

      {/* WhatsApp FAB */}
      <div className="fab-group">
        <a
          className="fab-wa"
          href="https://wa.me/+917296029277"
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
        >
          💬
        </a>
      </div>
    </main>
  );
}