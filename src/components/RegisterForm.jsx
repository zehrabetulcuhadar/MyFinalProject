import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from './../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

const RegisterForm = ({ setIsSignUp }) => {
    const navigate = useNavigate();

    const initialValues = {
      name: '',
      surname: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  
    const validationSchema = Yup.object({
      name: Yup.string().required('Adınız gereklidir'),
      surname: Yup.string().required('Soyadınız gereklidir'),
      email: Yup.string().email('Geçersiz email adresi').required('Email gereklidir'),
      password: Yup.string().required('Şifre gereklidir').min(6, 'Şifre en az 6 karakter olmalıdır'),
      confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Şifreler eşleşmiyor').required('Şifre tekrar gereklidir')
    });
  
    const handleSignupSubmit = async (values, { setSubmitting, setErrors }) => {
      const { email, password, name, surname } = values;
      try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          // Firestore'da kullanıcı profilini saklama, 'profile' koleksiyonu altında rastgele bir döküman ID'si ile
          const profileCollectionRef = collection(db, "users", user.uid, "profile");
          await addDoc(profileCollectionRef, {
              name,
              surname,
              email
          });

          // Firebase Auth'da displayName'i güncelle
          await updateProfile(user, {
            displayName: `${name} ${surname}`
          });

          navigate(`/dashboard/${user.uid}`, { state: { fromRegistration: true } });
      } catch (error) {
          setErrors({ submit: error.message });
      } finally {
          setSubmitting(false);
      }
    };
       

    return (
      <div>
        <h2 className="login-title">Kaydol</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSignupSubmit}
        >
          <Form className="formik-form">
            <div className="input-wrapper">
              <Field name="name" type="text" placeholder="Adınız" className="input-field" />
              <FiUser className="input-icon" />
              <ErrorMessage name="name" component="div" className="error-message" />
            </div>
            
            <div className="input-wrapper">
              <Field name="surname" type="text" placeholder="Soyadınız" className="input-field" />
              <FiUser className="input-icon" />
              <ErrorMessage name="surname" component="div" className="error-message" />
            </div>

            <div className="input-wrapper">
              <Field name="email" type="email" placeholder="Mail adresinizi girin" className="input-field" />
              <FiMail className="input-icon" />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>
            
            <div className="input-wrapper">
              <Field name="password" type="password" placeholder="Şifrenizi girin" className="input-field" />
              <FiLock className="input-icon" />
              <ErrorMessage name="password" component="div" className="error-message" />
            </div>
            
            <div className="input-wrapper">
              <Field name="confirmPassword" type="password" placeholder="Şifreyi Onayla" className="input-field" />
              <FiLock className="input-icon" />
              <ErrorMessage name="confirmPassword" component="div" className="error-message" />
            </div>
            
            <button type="submit" className="submit-button">Kaydol</button>
          </Form>
        </Formik>
      </div>    
  )
}

export default RegisterForm