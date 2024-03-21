import React from 'react'
import "./../assets/styles/Card.css";
import Card from 'react-bootstrap/Card';

function ColorCard({ variant }){ 
    const cardInfo = {
        Primary: {
          text: 'İZ uygulamasına Hoşgeldiniz',
          className: 'custom-primary',
        },
        Secondary: {
          text: 'Her gün on sorudan oluşan testi çözün. Gün içerisindeki modunuzun rengini öğrenin. Takvimde geçmiş günlerinizin renklerini görerek motive olun.',
          className: 'custom-secondary',
        },
        Success: {
          text: 'Günlük modunuza göre önerilen müzikler ile kendinizi dengede hissedin. Hatırlamak istediğiniz anlarınızı ya da hissetiklerinizi not alabilirsiniz.',
          className: 'custom-success',
        },
        Danger: {
          text: 'Ayın sonunda gönderilen duygu raporunuz ile duygu takibinizi sağlayın. Geçmiş raporlarınızı görerek duygu durumunuzun somut takibini sağlayın. ',
          className: 'custom-danger',
        },
      };

      const data = cardInfo[variant];

  return (
    <Card
      className={`mb-2 ${data.className}`}
      text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
    >
      <Card.Body>
        <Card.Text>
          {data.text}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default ColorCard