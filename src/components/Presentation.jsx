import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PresentationContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  font-family: 'LXGW WenKai TC', cursive;
  align-items: center;
  height: 100vh;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    height: auto;
  }
`;

const InfoSection = styled(motion.div)`
  display: flex;
  flex-direction: row;
  width: 48%;
  height: 48vh;
  margin: 2px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  align-items: center;
  font-weight: bold;
  font-size: 1.1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 97%;
    margin-bottom: 4px;
    height: auto;
    align-items: center;
  }
`;

const sectionVariants = (index) => ({
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: 'spring', 
      stiffness: 120,
      delay: 0.5 + index * 0.5, 
      duration: 1.5 
    }
  }
});

const Image = styled.img`
  width: 40%;
  height: auto;
  border-radius: 20px;
  margin: 10px;
`;

const Content = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  text-align: center;

  @media (max-width: 768px) {
    width: 80%;
  }
`;

const Title = styled.h2`
  margin-bottom: 10px;
`;

const Text = styled.p`
  padding: 0;
`;

const ExploreSection = ({ title, image, text, index, animate }) => {
  return (
    <InfoSection
      initial="hidden"
      animate={animate ? "visible" : "hidden"}
      variants={sectionVariants(index)}
    >
      <Image src={image} alt="Section Image" />
      <Content>
        <Title>{title}</Title>
        <Text>{text}</Text>
      </Content>
    </InfoSection>
  );
};

const Presentation = forwardRef(({ animate }, ref) => {
  return (
    <PresentationContainer ref={ref}>
      <ExploreSection 
        title="İZ Nedir ?" 
        image="/images/soru.jpg" 
        text="İZ uygulamasının amacı kullanıcıların duygu durumlarını belirlemesini kolaylaştırmak ve kullanıcının duygusal dengesini kurmasına yardımcı olmaktır." 
        animate={animate} 
        index={1}
      />
      <ExploreSection 
        title="Duygu Durumunu Nasıl Belirler ?" 
        image="/images/d-analiz.jpg" 
        text="Kullanıcıyı her gün teste tabi tutarak günlük duygusunu belirler. Kullanıcının teste vermiş olduğu cevapların sonucunda çıkarımda bulunduğu duyguya göre o gün için bir duygu rengi ataması yapar." 
        animate={animate} 
        index={2}
      />
      <ExploreSection
        title="Müzik Önerisi Sunar"
        image="/images/müzik.webp"
        text="Kullanıcının günlük duygu durumuna göre müzik önerilerinde bulunur. Bu öneriler ile kullanıcının duygusal dengeye ulaşmasını hedefler."
        index={3}
        animate={animate}
      />
      <ExploreSection
        title="Bilinçlenmesine Yardımcı Olur"
        image="/images/takip.jpg"
        text="Uygulama içerisindeki bilgilendirici yazılar sayesinde kullanıcının kendini geliştirmesine ve bilinçlenmesine yardımcı olur."
        index={4}
        animate={animate}
      />
    </PresentationContainer>
  );
});

export default Presentation