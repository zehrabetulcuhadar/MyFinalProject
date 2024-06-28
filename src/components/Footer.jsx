import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import emailjs from 'emailjs-com';
import { Container, Grid, Typography, TextField, Button, Box } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactFormSchema = Yup.object().shape({
    email: Yup.string().email('Geçersiz e-posta adresi').required('E-posta adresi gereklidir'),
    message: Yup.string().required('Mesajınızı yazınız')
});

const ContactForm = () => {
  const initialValues = {
    name: '',
    email: '',
    message: ''
  };
  
    const handleSubmit = (values, { setSubmitting, resetForm }) => {
      const templateParams = {
        from_name: values.name,
        from_email: values.email,
        message: values.message
    };

      emailjs.send('service_qiwouln', 'template_kys4lsr', templateParams, 'gyGCjq-VmMA4s0PDl')
      .then((response) => {
        toast.success('Mesajınız başarıyla gönderildi!');
        resetForm();
        }, (error) => {
            toast.error('Mesaj gönderilirken bir hata oluştu.');
        })
        .finally(() => {
            setSubmitting(false);
        });
      };
  
    return (
      <>
        <ToastContainer />
        <Formik
          initialValues={initialValues}
          validationSchema={ContactFormSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field as={TextField} name="email" label="E-posta" variant="outlined" fullWidth margin="normal" />
              <div style={{ minHeight: '24px' }}>
                <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
              </div>
              <Field as={TextField} name="message" label="Mesajınız" variant="outlined" multiline rows={4} fullWidth margin="normal" />
              <div style={{ minHeight: '24px' }}>
                <ErrorMessage name="message" component="div" style={{ color: 'red' }} />
              </div>
              <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} fullWidth>Gönder</Button>
            </Form>
          )}
        </Formik>
      </>
    );
  };
  

const Footer = () => {
    return (
      <Box sx={{
        backgroundColor: '#dfe8e9',
        paddingTop: '20px',
        paddingBottom: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        fontFamily: "'LXGW WenKai TC', cursive"
      }}>
        <Container maxWidth="lg" sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
          minHeight: '400px',
          width: '100%',
          maxWidth: '100%'
        }}>
          <Grid container spacing={3} alignItems="center" sx={{
            width: '90%',
            height: '100%',
            justifyContent: 'center',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <Grid item xs={12} md={6} sx={{
              background: 'linear-gradient(90deg, rgba(14,54,62), rgba(60,118,134), rgba(114,172,182), rgba(141,188,196))',
              borderRadius: { xs: '50px 50px 0px 0px', md: '50px 0px 0px 50px' },
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              color: 'white',
              height: '100%',
              minHeight: '357px'
            }}>
              <Typography variant="h6" component="h3" sx={{ color: 'white' }}>Kimiz?</Typography>
              <Typography variant="body2">Biz, 2024 yılında kurulmuş, dijital çözümler alanında uzmanlaşmış bir ekibiz. Amacımız, yenilikçi ve insan odaklı hizmetler sunarak sektörde fark yaratmaktır.</Typography>
              <Typography variant="h6" component="h3" sx={{ color: 'white', marginTop: '12px' }}>Ne Yapıyoruz?</Typography>
              <Typography variant="body2">Web ve mobil uygulama geliştirme ve yazılım çözümleri sunarak kullanıcılarımızın dijital çözümleri kullanarak mental sağlıklarına katkıda bulunmayı hedefliyoruz.</Typography>
              <Typography variant="h6" component="h3" sx={{ color: 'white', marginTop: '12px' }}>Misyonumuz ve Vizyonumuz</Typography>
              <Typography variant="body2">Misyonumuz, kullanıcılarımızın ruh sağlığının dengede kalmasını desteklemek. Vizyonumuz ise, dijital çözümler alanında öncü ve güvenilir bir marka olmaktır.</Typography>
              <Typography variant="h6" component="h3" sx={{ color: 'white', marginTop: '12px' }}>Ekibimiz</Typography>
              <Typography variant="body2">İlayda Özbay (Mobil Developer)</Typography>
              <Typography variant="body2">Zehra Betül Çuhadar (Web Developer)</Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{
              background: 'linear-gradient(270deg, rgba(120, 108, 130), rgba(231, 173, 149), rgba(245,188,128))',
              borderRadius: { xs: '0px 0px 50px 50px', md: '0px 50px 50px 0px' },
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              height: '100%',
              minHeight: '334px'
            }}>
              <Typography variant="h6" component="h3" sx={{ color: 'white' }}>İletişim</Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>
              Bizimle iletişime geçmek için{' '}
              <a href="mailto:ilzeh2024@gmail.com" style={{ color: 'white', textDecoration: 'underline' }}>ilzeh2024@gmail.com</a> 
              {' '}adresini kullanabilirsiniz. Daha fazla bilgi ve iş birliği için her zaman buradayız.
              </Typography>
              <ContactForm />
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
}

export default Footer