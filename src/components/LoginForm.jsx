import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './../assets/styles/LoginForm.css';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { auth } from './../firebaseConfig.js';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

const LoginForm = ({ setIsSignUp }) => {
  const navigate = useNavigate();
  const { setCurrentUser } = useUserContext();
  const provider = new GoogleAuthProvider();

  const initialValues = {
    email: '',
    password: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Geçersiz email adresi').required('Email gereklidir'),
    password: Yup.string().required('Şifre gereklidir')
  });

  const handleLoginSubmit = (values, { setSubmitting }) => {
    const { email, password } = values;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setCurrentUser(userCredential.user);
        navigate(`/dashboard/${userCredential.user.uid}`);
      })
      .catch((error) => {
        console.error('Login error:', error);
        toast.error('Giriş bilgileriniz hatalı. Lütfen tekrar deneyiniz.', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .finally(() => setSubmitting(false));
  };

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setCurrentUser(result.user);
        navigate(`/dashboard/${result.user.uid}`);
      })
      .catch((error) => {
        console.error('Google sign in error:', error);
        toast.error('Google ile giriş yapılırken bir hata oluştu.');
      });
  };

  const handleForgotPassword = (email) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success('Şifre sıfırlama linki e-posta adresinize gönderildi.');
      })
      .catch((error) => {
        console.error('Error sending password reset email:', error);
        toast.error('Şifre sıfırlama e-postası gönderilirken bir hata oluştu.');
      });
  };
  
  return (
    <div className="login-form-container">
      <h2 className="login-title">Giriş Yap</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLoginSubmit}
      >
        {({ values, isSubmitting }) => (
          <Form className="formik-form">
            <div className="input-wrapper">
              <Field name="email" type="email" placeholder="Mail adresinizi girin" className="input-field" />
              <FiMail className="input-icon" />
            </div>
            <ErrorMessage name="email" component="div" className="error-message" />

            <div className="input-wrapper">
              <Field name="password" type="password" placeholder="Şifrenizi girin" className="input-field" />
              <FiLock className="input-icon" />
            </div>
            <ErrorMessage name="password" component="div" className="error-message" />

            <button onClick={handleGoogleSignIn} className="google-sign-in-button">
              <FcGoogle className="google-icon" />
            </button>

            <div className="options-wrapper">
              <a href="#" className="password-reset-link" onClick={() => handleForgotPassword(values.email)}>Şifremi Unuttum</a>
            </div>

            <button type="submit" className="submit-button">GİRİŞ</button>
          </Form>
        )}
      </Formik>
      <ToastContainer />
    </div>
  )
}

export default LoginForm