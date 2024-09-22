import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link
import './Footer.css';
import Meta from '../components/Meta'; // Import Meta component

function Footer() {
  const newYear = new Date().getFullYear();

  return (
    <>
      {/* Meta Component for SEO */}
      <Meta
        title="LazzyShop - Stay Connected"
        description="Follow LazzyShop on social media platforms like Facebook, Twitter, Instagram, and LinkedIn. Stay updated with the latest offers and products."
        keywords="LazzyShop, contact, about us, social media, follow us"
      />

      <footer className="footer mt-auto py-4 bg-gray-900 text-white">
        <Container>
          <Row className="align-items-center justify-content-center text-center">
            <Col md={4} className="pb-3">
              <h5 className="text-uppercase font-weight-bold">About Us</h5>
              <div className="d-flex justify-content-center mt-4">
                <Link to="/about-us" className="text-white">
                  <p>Learn more about us</p>
                </Link>
              </div>
            </Col>
            <Col md={4} className="pb-3">
              <h5 className="text-uppercase font-weight-bold">Contact Us</h5>
              <div className="d-flex justify-content-center mt-4">
                <Link to="/contact-us" className="text-white">
                  <p>Get in touch</p>
                </Link>
              </div>
            </Col>
            <Col md={4} className="pb-3">
              <h5 className="text-uppercase font-weight-bold">Follow Us</h5>
              <div className="d-flex justify-content-center mt-4">
                {/* External social media links */}
                <a
                  href="https://facebook.com"
                  className="text-white mx-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook size="24px" />
                </a>
                <a
                  href="https://twitter.com"
                  className="text-white mx-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter size="24px" />
                </a>
                <a
                  href="https://instagram.com"
                  className="text-white mx-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram size="24px" />
                </a>
                <a
                  href="https://linkedin.com"
                  className="text-white mx-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin size="24px" />
                </a>
              </div>
            </Col>
          </Row>
          <Row>
            <Col className="text-center py-3">
              © {newYear} LazzyShop. All rights reserved.
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
}

export default Footer;
