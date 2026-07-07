import { Link } from 'react-router-dom';
import '../styles/Footer.css';

export default function Footer() {

  return (

    <footer className="footer">

      <div className="container footer-inner">

        <div className="footer-top">

          <div className="footer-brand-col">

            <Link
              to="/"
              className="brand footer-brand"
            >
              <span className="brand-mark">
                J
              </span>

              <span>
                JD Consultive
              </span>
            </Link>

            <p className="footer-tagline">
              Trusted recruitment and staffing partner
              helping businesses hire top talent across
              multiple industries throughout India.
            </p>

            <div className="social-row">

              <a
                className="soc"
                href="mailto:hr.jdhirings@gmail.com"
              >
                ✉️
              </a>

              <a
                className="soc"
                href="https://www.linkedin.com/company/jd-consultive/"
                target=""
                rel="noreferrer"
              >
                🔗
              </a>

              <a
                className="soc"
                href="/"
              >
                📷
              </a>

            </div>

          </div>

          <div className="footer-links-col">

            <h4>Company</h4>

            <Link to="/">
              Home
            </Link>

            <Link to="/services">
              Services
            </Link>

            <Link to="/about">
              About Us
            </Link>

            <Link to="/contact">
              Contact
            </Link>

          </div>

          <div className="footer-links-col">

            <h4>Industries</h4>

            <span>Information Technology</span>
            <span>BFSI</span>
            <span>FMCG</span>
            <span>EdTech</span>
            <span>Real Estate</span>
            <span>BPO / KPO</span>

          </div>

          <div className="footer-links-col">

            <h4>Contact</h4>

            <span>
              📞 +91 7296029277
            </span>

            <span>
              ✉️ hr.jdhirings@gmail.com
            </span>

            <span>
              📍 Noida, Delhi NCR
            </span>

            <span>
              ⏰ Mon-Sat, 9 AM - 6 PM
            </span>

          </div>

        </div>

        <div className="footer-bottom">

          <p>
            © 2026 JD Consultive.
            All rights reserved.
          </p>

          <p className="footer-sub">
            Recruitment • Staffing • Executive Search
          </p>

        </div>

      </div>

    </footer>

  );
}