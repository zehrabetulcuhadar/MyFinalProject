import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import emailjs from 'emailjs-com';
import { Box, Button, TextField, Typography } from '@mui/material';

const DashboardForm = ({ userId, handleClose }) => {
    const initialValues = {
        subject: '',
        message: ''
    };

    const validationSchema = Yup.object({
        subject: Yup.string().required('Konu gereklidir'),
        message: Yup.string().required('Mesaj gereklidir')
    });

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        const templateParams = {
            user_id: userId,
            subject: values.subject,
            message: values.message,
        };

        emailjs.send('service_qiwouln', 'template_kys4lsr', templateParams, 'gyGCjq-VmMA4s0PDl')
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                resetForm();
                handleClose();
                alert('Mesaj başarıyla gönderildi!');
            })
            .catch((error) => {
                console.log('FAILED...', error);
                alert('Mesaj gönderilirken bir hata oluştu.');
            });

        setSubmitting(false);
    };

  return (
    <Box sx={{ padding: '20px', background: 'linear-gradient(to right, rgba(147,164,174), rgba(151,168,178), rgba(179,191,201), rgba(222,231,233))', borderRadius: '8px' }}>
            <Typography variant="h5" component="h2" gutterBottom>
                İletişim ve Şikayet Formu
            </Typography>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Box sx={{ marginBottom: '16px' }}>
                            <Field
                                as={TextField}
                                name="subject"
                                label="Konu"
                                variant="outlined"
                                fullWidth
                                helperText={<ErrorMessage name="subject" />}
                            />
                        </Box>
                        <Box sx={{ marginBottom: '16px' }}>
                            <Field
                                as={TextField}
                                name="message"
                                label="Mesaj"
                                variant="outlined"
                                multiline
                                rows={4}
                                fullWidth
                                helperText={<ErrorMessage name="message" />}
                            />
                        </Box>
                        <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                            Gönder
                        </Button>
                    </Form>
                )}
            </Formik>
        </Box>
  )
}

export default DashboardForm