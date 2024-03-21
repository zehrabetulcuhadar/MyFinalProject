import React, { useState } from 'react';
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div>
      {isSignUp ? (
        <RegisterForm setIsSignUp={setIsSignUp} />
      ) : (
        <LoginForm setIsSignUp={setIsSignUp} />
      )}
    </div>
  )
}

export default Login