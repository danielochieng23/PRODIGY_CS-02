import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiHeart, FiUsers, FiStar, FiMapPin } from 'react-icons/fi';
import { useCategories } from '../contexts/CategoryContext';

const Container = styled.div`
  min-height: 100vh;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  color: var(--white);
  padding: 4rem 0;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: var(--font-weight-bold);
  margin-bottom: 1rem;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 1rem 2rem;
  background: var(--white);
  color: var(--primary-color);
  text-decoration: none;
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-semibold);
  font-size: 1.1rem;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-lg);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
  }
`;

const Section = styled.section`
  padding: 4rem 0;
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: var(--font-weight-bold);
  text-align: center;
  margin-bottom: 3rem;
  color: var(--gray-900);
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const CategoryCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: var(--white);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--gray-800);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-fast);
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary-color);
  }
`;

const CategoryIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 2rem;
  color: var(--white);
`;

const CategoryName = styled.h3`
  font-size: 1.25rem;
  font-weight: var(--font-weight-semibold);
  margin-bottom: 0.5rem;
`;

const CategoryCount = styled.p`
  font-size: var(--font-size-sm);
  color: var(--gray-600);
`;

const FeaturesSection = styled(Section)`
  background: var(--gray-100);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 2rem;
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: var(--radius-full);
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
  color: var(--white);
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: var(--font-weight-semibold);
  margin-bottom: 1rem;
  color: var(--gray-900);
`;

const FeatureDescription = styled.p`
  color: var(--gray-600);
  line-height: 1.6;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  font-size: 1.1rem;
  color: var(--gray-600);
`;

const HomePage: React.FC = () => {
  const { categories, loading } = useCategories();

  const defaultCategories = [
    { name: 'Call Girls', slug: 'call-girls', icon: '💋', count: 1250 },
    { name: 'Massages', slug: 'massages', icon: '💆', count: 850 },
    { name: 'Male Escorts', slug: 'male-escorts', icon: '👨', count: 620 },
    { name: 'Transsexuals', slug: 'transsexuals', icon: '🌈', count: 340 },
    { name: 'Adult Meetings', slug: 'adult-meetings', icon: '💑', count: 750 },
    { name: 'BDSM', slug: 'bdsm', icon: '🔗', count: 280 },
  ];

  const features = [
    {
      icon: <FiHeart />,
      title: 'Verified Profiles',
      description: 'All profiles are carefully verified to ensure authenticity and safety for our users.'
    },
    {
      icon: <FiUsers />,
      title: 'Large Community',
      description: 'Join thousands of users from around the world in our vibrant community.'
    },
    {
      icon: <FiStar />,
      title: 'Premium Quality',
      description: 'High-quality services and experiences with top-rated service providers.'
    },
    {
      icon: <FiMapPin />,
      title: 'Local & Global',
      description: 'Find services in your local area or explore options in other cities.'
    },
  ];

  return (
    <Container>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Welcome to Rubica</HeroTitle>
          <HeroSubtitle>
            Your trusted platform for premium classified ads. Connect with verified profiles 
            and discover exceptional services in your area.
          </HeroSubtitle>
          <CTAButton to="/ads">
            <FiStar />
            Explore Now
          </CTAButton>
        </HeroContent>
      </HeroSection>

      <Section>
        <SectionContainer>
          <SectionTitle>Browse Categories</SectionTitle>
          
          {loading ? (
            <LoadingSpinner>Loading categories...</LoadingSpinner>
          ) : (
            <CategoriesGrid>
              {(categories.length > 0 ? categories : defaultCategories).slice(0, 6).map((category, index) => (
                <CategoryCard key={category.slug || index} to={`/category/${category.slug}`}>
                  <CategoryIcon>
                    {category.icon || '📱'}
                  </CategoryIcon>
                  <CategoryName>{category.name}</CategoryName>
                  <CategoryCount>
                    {category.adCount || category.count || 0} ads
                  </CategoryCount>
                </CategoryCard>
              ))}
            </CategoriesGrid>
          )}
        </SectionContainer>
      </Section>

      <FeaturesSection>
        <SectionContainer>
          <SectionTitle>Why Choose Rubica?</SectionTitle>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <FeatureIcon>
                  {feature.icon}
                </FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </SectionContainer>
      </FeaturesSection>
    </Container>
  );
};

export default HomePage;