import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import './../assets/styles/LoginForm.css';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './../firebaseConfig.js'; // Firebase yapılandırmanızın olduğu dosyayı import edin
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginForm = ({ setIsSignUp }) => {
  const navigate = useNavigate();
  const { setCurrentUser } = useUserContext(); // UserContext'ten setCurrentUser fonksiyonunu al

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
  
  

  return (
    <div className="auth-form-container">
      <h2>Giriş Yap</h2>
      <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLoginSubmit}
      >
          <Form>
              <Field name="email" type="email" placeholder="Email" className="field-input" />
              
              <Field name="password" type="password" placeholder="Şifre" className="field-input" />
              
              <button type="submit">Giriş Yap</button>

              <a href="#" onClick={() => {/* Şifremi unuttum işlemleri */}} className="password-reset">Şifremi Unuttum</a>
          </Form>
      </Formik>
      <button type="button" onClick={() => setIsSignUp(true)}>
          Hesabınız yok mu? Kaydolun
      </button>
      <ToastContainer />
    </div>
  )
}

export default LoginForm