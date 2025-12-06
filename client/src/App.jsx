import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ResetPassword from './pages/ResetPassword'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import { ToastContainer } from 'react-toastify'
import VerifyOtp from './pages/VerifyOtp'
import AuthForm from './pages/Login'

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<AuthForm />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        <Route path='/verify-otp' element={<VerifyOtp />} />
      </Routes>
    </>
  )
}

export default App
