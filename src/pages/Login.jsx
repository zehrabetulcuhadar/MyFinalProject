import React, { useState } from 'react';
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="page-container">
      <div className="form-container">
        {isSignUp ? (
          <RegisterForm setIsSignUp={setIsSignUp} />
        ) : (
          <LoginForm setIsSignUp={setIsSignUp} />
        )}
      </div>
      <div className="community-container">
        {isSignUp ? (
          <div className='register-page-community'>
            <h2>Çoktan Aramıza Katıldızın Mı ?</h2>
            <p> Şifrenizi Unuttuysanız Sıfırlayabilirsiniz !</p>
            <button onClick={() => setIsSignUp(!isSignUp)} className='toggle-button'>
              Hesabınız Var Mı ? Giriş Yapın
            </button>
          </div>
        ):(
          <div className='login-page-comunity'>
            <h2>Bize Katılın</h2>
            <p>Kayıt olarak duygu takibinize başlayabilirsiniz !</p>
            <button onClick={() => setIsSignUp(!isSignUp)} className='toggle-button'>
              Hesabınız Yok Mu ? Kayıt Olun
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login