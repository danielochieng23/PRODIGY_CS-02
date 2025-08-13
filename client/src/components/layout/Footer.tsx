import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const FooterContainer = styled.footer`
  background: var(--gray-900);
  color: var(--white);
  padding: 3rem 0 1rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    margin-bottom: 1rem;
    color: var(--white);
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLink = styled.li`
  margin-bottom: 0.5rem;

  a {
    color: var(--gray-300);
    text-decoration: none;
    font-size: var(--font-size-sm);
    transition: color var(--transition-fast);

    &:hover {
      color: var(--primary-color);
    }
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: 0.5rem;
  font-size: var(--font-size-sm);
  color: var(--gray-300);
`;

const FooterBottom = styled.div`
  border-top: 1px solid var(--gray-700);
  padding-top: 1rem;
  text-align: center;
  color: var(--gray-400);
  font-size: var(--font-size-sm);
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <h3>Rubica</h3>
            <p style={{ color: 'var(--gray-300)', marginBottom: '1rem', fontSize: 'var(--font-size-sm)' }}>
              Your trusted platform for premium classified ads. Connect with verified profiles 
              and discover exceptional services.
            </p>
            <ContactInfo>
              <FiMail />
              support@rubica.com
            </ContactInfo>
            <ContactInfo>
              <FiPhone />
              +1 (555) 123-4567
            </ContactInfo>
            <ContactInfo>
              <FiMapPin />
              New York, NY 10001
            </ContactInfo>
          </FooterSection>

          <FooterSection>
            <h3>Categories</h3>
            <FooterLinks>
              <FooterLink><Link to="/category/call-girls">Call Girls</Link></FooterLink>
              <FooterLink><Link to="/category/massages">Massages</Link></FooterLink>
              <FooterLink><Link to="/category/male-escorts">Male Escorts</Link></FooterLink>
              <FooterLink><Link to="/category/transsexuals">Transsexuals</Link></FooterLink>
              <FooterLink><Link to="/category/adult-meetings">Adult Meetings</Link></FooterLink>
              <FooterLink><Link to="/category/bdsm">BDSM</Link></FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <h3>Support</h3>
            <FooterLinks>
              <FooterLink><Link to="/help">Help Center</Link></FooterLink>
              <FooterLink><Link to="/safety">Safety Guidelines</Link></FooterLink>
              <FooterLink><Link to="/contact">Contact Us</Link></FooterLink>
              <FooterLink><Link to="/faq">FAQ</Link></FooterLink>
              <FooterLink><Link to="/blog">Blog</Link></FooterLink>
              <FooterLink><Link to="/advertise">Advertise</Link></FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <h3>Legal</h3>
            <FooterLinks>
              <FooterLink><Link to="/terms">Terms of Service</Link></FooterLink>
              <FooterLink><Link to="/privacy">Privacy Policy</Link></FooterLink>
              <FooterLink><Link to="/cookies">Cookie Policy</Link></FooterLink>
              <FooterLink><Link to="/dmca">DMCA</Link></FooterLink>
              <FooterLink><Link to="/disclaimer">Disclaimer</Link></FooterLink>
              <FooterLink><Link to="/age-verification">Age Verification</Link></FooterLink>
            </FooterLinks>
          </FooterSection>
        </FooterGrid>

        <FooterBottom>
          <p>
            © {new Date().getFullYear()} Rubica.com. All rights reserved. 
            This website is intended for adults only (18+).
          </p>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;