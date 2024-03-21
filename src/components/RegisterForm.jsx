import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from './../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({ setIsSignUp }) => {
    const navigate = useNavigate();

    const initialValues = {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    };
  
    const validationSchema = Yup.object({
        fullName: Yup.string().required('Adınız ve soyadınız gereklidir'),
        email: Yup.string().email('Geçersiz email adresi').required('Email gereklidir'),
        password: Yup.string().required('Şifre gereklidir'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Şifreler eşleşmiyor').required('Şifre tekrar gereklidir')
    });
  
    const handleSignupSubmit = (values, { setSubmitting, setErrors }) => {
        const { email, password, fullName } = values;
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            // kullanıcı profilini Firestore'a kaydetmek için burayı güncelle
            const userProfileRef = doc(db, 'users', user.uid, 'profile', 'profileDocument'); // Firestore path'i
      
            // fullName'i firstName ve lastName olarak ayırın
            const [name, surname] = fullName.split(' ');
            
            // Firestore'da yeni bir profil dökümanı oluştur
            setDoc(userProfileRef, {
              name: name,
              surname: surname || 'surname',
              email: email,
            }).then(() => {
              navigate(`/dashboard/${user.uid}`, { state: { fromRegistration: true } });
            });
            
            // Firebase Auth'da display name'i güncelle
            updateProfile(user, {
              displayName: fullName
            });
      
          })
          .catch((error) => {
            setErrors({ submit: error.message });
          })
          .finally(() => {
            setSubmitting(false);
          });
      };
      
  

    return (
        <div className="auth-form-container">
            <h2>Kaydol</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSignupSubmit}
            >
                <Form>
                    <Field name="fullName" type="text" placeholder="Adınız ve Soyadınız" className="field-input" />
                    <ErrorMessage name="fullName" component="div" className="error-message" />
                    
                    <Field name="email" type="email" placeholder="Email" className="field-input" />
                    <ErrorMessage name="email" component="div" className="error-message" />
                    
                    <Field name="password" type="password" placeholder="Şifre" className="field-input" />
                    <ErrorMessage name="password" component="div" className="error-message" />
                    
                    <Field name="confirmPassword" type="password" placeholder="Şifreyi Onayla" className="field-input" />
                    <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                    
                    <button type="submit">Kaydol</button>
                </Form>
            </Formik>
            <button type="button" onClick={() => setIsSignUp(false)}>
                Zaten hesabınız var mı? Giriş yapın
            </button>
        </div>
  )
}

export default RegisterForm