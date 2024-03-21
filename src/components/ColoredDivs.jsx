import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ColoredDivsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 20%;
`;

const ColoredDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  padding: 10px;
  background-color: #ff7675;
  overflow: hidden;

  @media (max-width: 768px) { /* Ekran genişliği 768px ve altı için */
    flex-direction: column; /* Dikey düzen */
    align-items: flex-start; /* İçeriği yukarı hizalayın */
    }

`;

const ColoredImage = styled(motion.img)`
  max-width: 40%;
  border-radius: 20px;

  @media (max-width: 768px) { /* Ekran genişliği 768px ve altı için */
  max-width: 60%; /* Tam genişlik */
  order: -1; /* Resmi metnin üstüne taşıyın */
  margin: auto;
}
`;

const ColoredText = styled(motion.div)`
  flex: 1;
  padding: 30px;
  font-size: 30px;
  position: relative;
  opacity: 0;

  @media (max-width: 768px) { /* Ekran genişliği 768px ve altı için */
  padding: 15px; /* Daha küçük dolgu */
  font-size: 18px; /* Daha küçük yazı tipi boyutu */
  text-align: center;
}
`;

const ColoredDiv1 = styled(ColoredDiv)`
  background-color: #ff7675;
`;

const ColoredDiv2 = styled(ColoredDiv)`
  background-color: #74b9ff;
`;

const ColoredDiv3 = styled(ColoredDiv)`
  background-color: #55efc4;
`;

const ColoredDiv4 = styled(ColoredDiv)`
  background-color: #ffeaa7;
`;

const ColoredDivs = () => {
    const [ref1, inView1] = useInView({ triggerOnce: true });
    const [ref2, inView2] = useInView({ triggerOnce: true });
    const [ref3, inView3] = useInView({ triggerOnce: true });
    const [ref4, inView4] = useInView({ triggerOnce: true });
  
    const controls1 = useAnimation();
    const controls2 = useAnimation();
    const controls3 = useAnimation();
    const controls4 = useAnimation();

    const animateText = (controls, inView) => {
      if (inView) {
        controls.start({ opacity: 1, x: 0 });
      } else {
        controls.start({ opacity: 0, x: '-100%' });
      }
    };

    useEffect(() => {
       animateText(controls1, inView1);
      }, [controls1, inView1]);

    useEffect(() => {
      animateText(controls2, inView2);
      }, [controls2, inView2]);
    
      useEffect(() => {
        animateText(controls3, inView3);
       }, [controls3, inView3]);

       useEffect(() => {
        animateText(controls4, inView4);
       }, [controls4, inView4]);
      
       const handleScroll = useCallback(() => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
      
        // Calculate the offset to trigger the animation
        const offset = windowHeight * 0.7; // Adjust this value as needed
      
        // Check if the ref.current exists before accessing its properties
        if (ref1.current) {
          // Calculate the progress of the animation based on scroll position
          const progress = (scrollY - ref1.current.offsetTop + offset) / windowHeight;
      
          // Update the opacity and x position of the text element
          controls1.start({ opacity: progress, x: -100 + progress * 100 });
        }
        // ... similarly, add checks for other refs ...
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [controls1, controls2, controls3, controls4]);
      

      useEffect(() => {
        // Add event listener for scroll
        window.addEventListener('scroll', handleScroll);
    
        // Remove the event listener when the component unmounts
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, [handleScroll]);

    useEffect(() => {
      if (inView1) {
        controls1.start({ opacity: 1, x: 0 });
      } else {
        controls1.start({ opacity: 0, x: '100%' });
      }
    }, [controls1, inView1]);
  
    useEffect(() => {
      if (inView2) {
        controls2.start({ opacity: 1, x: 0 });
      } else {
        controls2.start({ opacity: 0, x: '100%' });
      }
    }, [controls2, inView2]);
  
    useEffect(() => {
      if (inView3) {
        controls3.start({ opacity: 1, x: 0 });
      } else {
        controls3.start({ opacity: 0, x: '100%' });
      }
    }, [controls3, inView3]);
  
    useEffect(() => {
      if (inView4) {
        controls4.start({ opacity: 1, x: 0 });
      } else {
        controls4.start({ opacity: 0, x: '100%' });
      }
    }, [controls4, inView4]);

  return (
    <ColoredDivsContainer>
      <ColoredDiv1 ref={ref1}>
        <ColoredImage
          src="/images/soru.jpg"
          alt="Image1"
          initial={{ opacity: 0, x: '100%' }}
          animate={controls1}
          transition={{ duration: 0.5 }}
        />
        <ColoredText animate={controls1}>
            <h3>İZ Nedir ?</h3>
            <p>İZ uygulamasının amacı kullanıcıların duygu durumlarını takip etmelerini kolaylaştırmak ve kullanıcının duygusal dengesini kurmasına yardımcı olmaktır.</p>
        </ColoredText>
      </ColoredDiv1>
      <ColoredDiv2 ref={ref2}>
        <ColoredImage
          src="/images/d-analiz.jpg"
          alt="Image2"
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: inView2 ? 1 : 0, x: inView2 ? 0 : '100%' }}
          transition={{ duration: 0.5 }}
        />
        <ColoredText animate={controls2}>
          <h3>Duygu Durumunu Nasıl Belirler ?</h3>
          <p>Kullanıcıyı her gün teste tabi tutarak günlük duygusunu belirler. Kullanıcının teste vermiş olduğu cevapların sonucunda çıkarımda bulunduğu duyguya göre o gün için bir duygu rengi ataması yapar.</p>
        </ColoredText>
      </ColoredDiv2>
      <ColoredDiv3 ref={ref3}>
        <ColoredImage
          src="/images/müzik.webp"
          alt="Image3"
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: inView3 ? 1 : 0, x: inView3 ? 0 : '100%' }}
          transition={{ duration: 0.5 }}
        />
        <ColoredText animate={controls3}>
          <h3>Müzik Önerisi Sunar</h3>
          <p>Kullanıcının günlük duygu durumuna göre müzik önerilerinde bulunur. Bu öneriler ile kullanıcının duygusal dengeye ulaşmasını hedefler.</p>
        </ColoredText>
      </ColoredDiv3>
      <ColoredDiv4 ref={ref4}>
        <ColoredImage
          src="/images/takip.jpg"
          alt="Image4"
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: inView4 ? 1 : 0, x: inView4 ? 0 : '100%' }}
          transition={{ duration: 0.5 }}
        />
        <ColoredText animate={controls4}>
          <h3>Aylık Duygusal Rapor Gönderir</h3>
          <p>Tüm ay boyunca duygunuzu takip eder ve ay sonunda bir duygu analizi raporu gönderir. Geçmiş raporlarınıza da ulaşmanızı sağlar. Bu sayede uzun vadede duygusal durumunuzun ilerleyişini de takip edebilirsiniz.</p>
        </ColoredText>
      </ColoredDiv4>
    </ColoredDivsContainer>
  )
}

export default ColoredDivs