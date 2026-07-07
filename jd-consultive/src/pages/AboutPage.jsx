import '../styles/AboutPage.css';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function About() {

  useEffect(() => {

  const items =
    document.querySelectorAll(
      '.timeline-item'
    );

  const observer =
    new IntersectionObserver(

      (entries) => {

        entries.forEach(
          (entry) => {

            if (
              entry.isIntersecting
            ) {

              entry.target.classList.add(
                'show'
              );

            }

          }
        );

      },

      {
        threshold: 0.2,
      }
    );

  items.forEach(
    (item) =>
      observer.observe(item)
  );

  return () => {

    items.forEach(
      (item) =>
        observer.unobserve(item)
    );

  };

}, []);

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50
    },
    visible: {
      opacity:1,
      y: 0
    }
  };


  return (
    <main className="about-page">

      <section className="about-hero">
        <h1>About JD Consultive</h1>

        <p>
          We help businesses hire better,
          faster and smarter through
          recruitment solutions designed
          for modern organizations.
        </p>
      </section>

      <section className="about-grid">

        <div className="about-card">
          <h2>Who We Are</h2>

          <p>
            JD Consultive is a strategic recruitment and workforce solutions partner helping organizations hire exceptional talent across India.
          </p>
        </div>

        <div className="about-card">
          <h2>Our Mission</h2>

          <p>
            To deliver high-quality talent through a faster, transparent and result-oriented recruitment process.
          </p>
        </div>

        <div className="about-card">
          <h2>Why Companies Choose Us</h2>

          <ul className="about-list">
            <li>Industry Expertise</li>
            <li>Fast Turnaround</li>
            <li>Rigorous Screening</li>
            <li>Pan India Network</li>
            <li>Dedicated Support</li>
            <li>High Success Rate</li>
          </ul>
        </div>

        <div className="about-card">
          <h2>Our Vision</h2>

          <p>
            To become one of India's
            most trusted recruitment
            partners for startups,
            SMEs and enterprises.
          </p>
        </div>

      </section>

      <section className="process-section">

  <div className="section-heading">

    <span>OUR PROCESS</span>

    <h2>
      Our Recruitment Methodology
    </h2>

    <p>
      A proven hiring framework that helps us identify,
      evaluate and place top talent efficiently while
      ensuring quality at every stage.
    </p>

  </div>

 <motion.div
  className="timeline"
  variants={cardVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  transition={{
    duration: 0.6
  }}
>

    <motion.div
  className="timeline-item left"
  variants={cardVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  transition={{
    duration: 0.6
  }}
>

      <motion.div
  className="timeline-content"
  variants={cardVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  transition={{
    duration: 0.6
  }}
>

        <span className="timeline-number">
          01
        </span>

        <h3>
          Requirement Analysis
        </h3>

        <p>
          We work closely with clients to understand
          business objectives, role expectations,
          culture fit and hiring priorities.
        </p>

      </motion.div>

    </motion.div>

    <motion.div
  className="timeline-item right"
  variants={cardVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  transition={{
    duration: 0.6
  }}
>

      <motion.div
  className="timeline-content"
  variants={cardVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  transition={{
    duration: 0.6
  }}
>

        <span className="timeline-number">
          02
        </span>

        <h3>
          Candidate Sourcing
        </h3>

        <p>
          Using our database, referrals and industry
          networks, we identify high-potential
          professionals aligned with requirements.
        </p>

      </motion.div>

    </motion.div>

    <div className="timeline-item left">

      <div className="timeline-content">

        <span className="timeline-number">
          03
        </span>

        <h3>
          Screening & Interviews
        </h3>

        <p>
          Every candidate undergoes detailed
          evaluation covering skills, communication,
          experience and role suitability.
        </p>

      </div>

    </div>

    <div className="timeline-item right">

      <div className="timeline-content">

        <span className="timeline-number">
          04
        </span>

        <h3>
          Shortlisting
        </h3>

        <p>
          Only the most relevant and qualified
          candidates are presented to clients for
          further consideration.
        </p>

      </div>

    </div>

    <div className="timeline-item left">

      <div className="timeline-content">

        <span className="timeline-number">
          05
        </span>

        <h3>
          Offer Management
        </h3>

        <p>
          We facilitate offer discussions,
          negotiations and onboarding coordination
          to ensure smooth closures.
        </p>

      </div>

    </div>

    <div className="timeline-item right">

      <div className="timeline-content">

        <span className="timeline-number">
          06
        </span>

        <h3>
          Successful Joining
        </h3>

        <p>
          Continuous follow-up ensures successful
          onboarding and long-term placement success.
        </p>

      </div>

    </div>

  </motion.div>

</section>

    </main>
  );
}