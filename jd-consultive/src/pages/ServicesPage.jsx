import '../styles/ServicesPage.css';
import { Link } from 'react-router-dom';

export default function ServicesPage() {

  const services = [
    {
      title: 'Permanent Hiring',
      desc:
'Our permanent hiring solutions help businesses recruit professionals who align with both technical requirements and company culture. We manage sourcing, screening, interview coordination, and offer closure to ensure faster hiring outcomes.'
    },
    {
      title: 'Contract Staffing',
      desc:
        'Flexible staffing solutions designed to support project-based, seasonal, and temporary workforce requirements.'
    },
    {
      title: 'Bulk Hiring',
      desc:
        'Rapid recruitment support for organizations expanding operations, launching new projects, or opening new locations.'
    },
    {
      title: 'Executive Search',
      desc:
        'Specialized leadership hiring for strategic and senior management positions.'
    }
  ];

  const industries = [
    'Information Technology',
    'BFSI',
    'FMCG',
    'EdTech',
    'Real Estate',
    'BPO / KPO',
    'Digital Marketing',
    'Healthcare',
    'Manufacturing',
    'Retail',
    'Telecom',
    'Logistics'
  ];

  return (
    <div className="services-page">

      <section className="page-hero">
        <h1>Our Services</h1>
        <p>
          Comprehensive recruitment and talent acquisition
          solutions designed to help organizations build
          high-performing teams.
        </p>
      </section>

      <section className="services-grid">

        {services.map((service) => (

          <div
            key={service.title}
            className="services-card"
          >
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
          </div>

        ))}

      </section>

      <section className="industries-section">

        <h2>Industries We Serve</h2>

        <div className="industry-grid">

          {industries.map((item) => (

            <div
              key={item}
              className="industry-pill"
            >
              {item}
            </div>

          ))}

        </div>

      </section>

      <section className="why-choose-section">

  <div className="section-header">
    <span>WHY CHOOSE US</span>
    <h2>Recruitment Built For Business Growth</h2>
  </div>

  <div className="why-grid">

    <div className="why-card">
      <h3>Industry Expertise</h3>
      <p>
        Specialized recruitment solutions tailored
        to industry-specific hiring requirements.
      </p>
    </div>

    <div className="why-card">
      <h3>Fast Turnaround</h3>
      <p>
        Reduced hiring timelines through efficient
        sourcing and screening processes.
      </p>
    </div>

    <div className="why-card">
      <h3>Quality Screening</h3>
      <p>
        Multi-stage candidate evaluation ensuring
        only qualified profiles reach clients.
      </p>
    </div>

    <div className="why-card">
      <h3>Pan India Reach</h3>
      <p>
        Access to talent pools across major cities
        and emerging markets.
      </p>
    </div>

  </div>

</section>

<section className="service-process">

  <div className="section-header">
    <span>OUR PROCESS</span>
    <h2>How We Deliver Hiring Success</h2>
  </div>

  <div className="process-grid">

    <div className="process-card">
      <span>01</span>
      <h3>Requirement Gathering</h3>
    </div>

    <div className="process-card">
      <span>02</span>
      <h3>Talent Sourcing</h3>
    </div>

    <div className="process-card">
      <span>03</span>
      <h3>Screening & Evaluation</h3>
    </div>

    <div className="process-card">
      <span>04</span>
      <h3>Interview Coordination</h3>
    </div>

    <div className="process-card">
      <span>05</span>
      <h3>Offer Management</h3>
    </div>

    <div className="process-card">
      <span>06</span>
      <h3>Successful Onboarding</h3>
    </div>

  </div>

</section>

<section className="service-cta">

  <h2>
    Looking To Build A Stronger Team?
  </h2>

  <p>
    Partner with JD Consultive and
    hire qualified talent faster.
  </p>

  <Link
  to="/contact"
  className='cta-btn'
>
  Start Hiring Today
</Link>

</section>

    </div>
  );
}