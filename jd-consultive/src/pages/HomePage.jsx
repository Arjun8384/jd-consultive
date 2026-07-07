import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/HomePage.css';

export default function HomePage() {

  const [stats, setStats] = useState({
    hires: 0,
    clients: 0,
    success: 0
  });

  useEffect(() => {

    let hires = 0;
    let clients = 0;
    let success = 0;

    const timer = setInterval(() => {

      hires = Math.min(hires + 5, 500);
      clients = Math.min(clients + 1, 75);
      success = Math.min(success + 1, 98);

      setStats({
        hires,
        clients,
        success
      });

      if (
        hires === 500 &&
        clients === 75 &&
        success === 98
      ) {
        clearInterval(timer);
      }

    }, 20);

    return () => clearInterval(timer);

  }, []);

  return (

    <main>

      {/* HERO */}

      <section className="hero">

        <div className="container hero-inner">

          <div>

            <div className="eyebrow">
              HR Consultancy • Pan India
            </div>

            <h1>
              Connecting Great
              <span className="gradient-text">
                {' '}Talent
              </span>
              {' '}With Great Companies
            </h1>

            <p>
              JD Consultive helps organizations hire
              skilled professionals across IT, BFSI,
              FMCG, EdTech, Real Estate, BPO/KPO,
              Digital Marketing and Corporate functions.
              We simplify hiring while helping candidates
              discover meaningful career opportunities.
            </p>

            <div className="hero-buttons">

              <Link
                to="/contact"
                className="btn btn-p"
              >
                Hire Talent
              </Link>

              <Link
                to="/services"
                className="btn btn-s"
              >
                Explore Services
              </Link>

            </div>

          </div>

          <div className="hero-card">

            <div className="hero-card-item">
              ⚡ Profiles Shared Within 24-48 Hours
            </div>

            <div className="hero-card-item">
              🎯 Industry Specific Recruitment
            </div>

            <div className="hero-card-item">
              🤝 Dedicated Hiring Support
            </div>

            <div className="hero-card-item">
              📈 Faster Hiring Cycles
            </div>

          </div>

        </div>

      </section>

      {/* STATS */}

      <section className="section">

        <div className="container">

          <h2 className="section-title">
            Recruitment That Delivers Results
          </h2>

          <p className="section-subtitle">
            Helping businesses grow and professionals
            advance their careers through efficient
            recruitment solutions.
          </p>

          <div className="stats-grid">

            <div className="stat-card">
              <div className="stat-number">
                {stats.hires}+
              </div>
              <p>Successful Placements</p>
            </div>

            <div className="stat-card">
              <div className="stat-number">
                {stats.clients}+
              </div>
              <p>Client Organizations</p>
            </div>

            <div className="stat-card">
              <div className="stat-number">
                {stats.success}%
              </div>
              <p>Hiring Success Rate</p>
            </div>

            <div className="stat-card">
              <div className="stat-number">
                48H
              </div>
              <p>Average Profile Delivery</p>
            </div>

          </div>

        </div>

      </section>

      {/* INDUSTRIES */}

      <section className="section">

        <div className="container">

          <h2 className="section-title">
            Industries We Serve
          </h2>

          <p className="section-subtitle">
            We recruit across multiple domains,
            helping businesses hire professionals
            who align with their goals.
          </p>

          <div className="industries-grid">

            {[
              'Information Technology',
              'FMCG',
              'BFSI',
              'EdTech',
              'Real Estate',
              'BPO / KPO',
              'Digital Marketing',
              'Healthcare'
            ].map((industry) => (

              <div
                key={industry}
                className="industry-card"
              >
                <h3>{industry}</h3>
              </div>

            ))}

          </div>

        </div>

      </section>

            {/* ROLES */}

      <section className="section">

        <div className="container">

          <h2 className="section-title">
            Roles We Hire For
          </h2>

          <p className="section-subtitle">
            From technical specialists to leadership
            positions, we help organizations find the
            right talent across business functions.
          </p>

          <div className="roles-grid">

            {[
              'Frontend Developer',
              'Backend Developer',
              'Full Stack Developer',
              'DevOps Engineer',
              'QA Engineer',
              'UI/UX Designer',
              'HR Executive',
              'Talent Acquisition Specialist',
              'Sales Executive',
              'Business Development Manager',
              'SEO Specialist',
              'Digital Marketing Executive',
              'Customer Support Executive',
              'BPO Associate',
              'Finance Executive',
              'Relationship Manager'
            ].map((role) => (

              <div
                key={role}
                className="role-card"
              >
                {role}
              </div>

            ))}

          </div>

        </div>

      </section>

      {/* WHY CHOOSE US */}

      <section className="section">

        <div className="container">

          <h2 className="section-title">
            Why Choose JD Consultive
          </h2>

          <p className="section-subtitle">
            We combine recruitment expertise,
            industry understanding and candidate
            assessment to deliver quality hiring
            outcomes consistently.
          </p>

          <div className="why-grid">

            {[
              {
                title: 'Fast Turnaround',
                desc: 'Receive qualified profiles quickly without compromising candidate quality.'
              },
              {
                title: 'Pre-Screened Talent',
                desc: 'Every candidate undergoes initial screening before profile submission.'
              },
              {
                title: 'Pan India Hiring',
                desc: 'Support for recruitment requirements across multiple cities and locations.'
              },
              {
                title: 'Industry Expertise',
                desc: 'Specialized recruitment knowledge across various business sectors.'
              },
              {
                title: 'Dedicated Recruiters',
                desc: 'A focused team works closely on every hiring assignment.'
              },
              {
                title: 'Long-Term Partnerships',
                desc: 'Building sustainable recruitment relationships with clients.'
              }
            ].map((item) => (

              <div
                key={item.title}
                className="why-card"
              >

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.desc}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* HIRING PROCESS */}

      <section className="section">

        <div className="container">

          <h2 className="section-title">
            Our Hiring Process
          </h2>

          <p className="section-subtitle">
            A structured recruitment workflow
            designed to reduce hiring time and
            improve candidate quality.
          </p>

          <div className="process-grid">

            <div className="process-card">

              <div className="process-number">
                01
              </div>

              <div>

                <h3>
                  Requirement Understanding
                </h3>

                <p>
                  We begin with detailed discussions
                  to understand the role, business
                  objectives, company culture and
                  candidate expectations.
                </p>

              </div>

            </div>

            <div className="process-card">

              <div className="process-number">
                02
              </div>

              <div>

                <h3>
                  Talent Sourcing
                </h3>

                <p>
                  Our recruitment team actively
                  identifies suitable candidates
                  through multiple sourcing channels
                  and professional networks.
                </p>

              </div>

            </div>

            <div className="process-card">

              <div className="process-number">
                03
              </div>

              <div>

                <h3>
                  Screening & Evaluation
                </h3>

                <p>
                  Candidates are assessed for
                  technical skills, communication,
                  experience and role suitability
                  before profile submission.
                </p>

              </div>

            </div>

            <div className="process-card">

              <div className="process-number">
                04
              </div>

              <div>

                <h3>
                  Interview Coordination
                </h3>

                <p>
                  We manage scheduling, follow-ups,
                  feedback collection and stakeholder
                  communication throughout the process.
                </p>

              </div>

            </div>

            <div className="process-card">

              <div className="process-number">
                05
              </div>

              <div>

                <h3>
                  Offer & Joining Support
                </h3>

                <p>
                  Our involvement continues until
                  successful onboarding and joining
                  of the selected candidate.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

            {/* CLIENT TESTIMONIALS */}

      <section className="section">

        <div className="container">

          <h2 className="section-title">
            What Our Clients Say
          </h2>

          <p className="section-subtitle">
            Trusted by growing businesses across
            multiple industries for quality hiring
            support and reliable recruitment delivery.
          </p>

          <div className="testimonial-grid">

            <div className="testimonial-card">

              <p>
                "JD Consultive consistently delivered
                relevant candidates within short
                timelines. Their understanding of
                our hiring requirements saved us
                significant recruitment effort."
              </p>

              <div className="testimonial-author">
                HR Manager
                <br />
                IT Services Company
              </div>

            </div>

            <div className="testimonial-card">

              <p>
                "The quality of shortlisted profiles
                was impressive. We were able to close
                multiple positions faster than our
                previous hiring cycles."
              </p>

              <div className="testimonial-author">
                Talent Acquisition Lead
                <br />
                BFSI Organization
              </div>

            </div>

            <div className="testimonial-card">

              <p>
                "Professional communication,
                transparent coordination and
                dependable recruitment support
                throughout the engagement."
              </p>

              <div className="testimonial-author">
                Founder
                <br />
                EdTech Startup
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* CANDIDATE TESTIMONIALS */}

      <section className="section">

        <div className="container">

          <h2 className="section-title">
            Candidate Success Stories
          </h2>

          <p className="section-subtitle">
            Helping professionals secure
            opportunities aligned with their
            skills, experience and career goals.
          </p>

          <div className="testimonial-grid">

            <div className="testimonial-card">

              <p>
                "The recruitment team kept me updated
                throughout every stage of the process.
                I secured a role that matched my
                technical background and expectations."
              </p>

              <div className="testimonial-author">
                Software Developer
              </div>

            </div>

            <div className="testimonial-card">

              <p>
                "Unlike many consultancies, they
                genuinely understood my profile and
                connected me with opportunities that
                aligned with my career path."
              </p>

              <div className="testimonial-author">
                Relationship Manager
              </div>

            </div>

            <div className="testimonial-card">

              <p>
                "Excellent guidance, professional
                communication and timely interview
                coordination. The entire process was
                smooth from start to finish."
              </p>

              <div className="testimonial-author">
                Business Development Executive
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="section">

        <div className="container">

          <div className="cta-section">

            <h2>
              Ready To Build Your Team?
            </h2>

            <p
              style={{
                maxWidth: '700px',
                margin: '20px auto'
              }}
            >
              Whether you are hiring talent or
              searching for your next career
              opportunity, JD Consultive is
              ready to help.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginTop: '30px'
              }}
            >

              <Link
                to="/contact"
                className="btn btn-p"
              >
                Contact Us
              </Link>

              <Link
                to="/services"
                className="btn btn-s"
              >
                View Services
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* WHATSAPP FLOAT */}

      <a
        href="https://wa.me/917296029277"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
      >
        💬
      </a>

    </main>

  );

}