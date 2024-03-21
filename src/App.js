import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS'ini import edin
import { ToastContainer } from 'react-toastify'; // ToastContainer'ı import edin
import HomePage from './pages/HomePage';
import About from './pages/About';
import "./App.css";
import Login from './pages/Login';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Notes from './pages/Notes';
import TestModal from './components/TestModal';
import { UserContextProvider } from './context/UserContext';

const App = () => {
  return (
    <UserContextProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path='/hakkimizda' element={<About />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/iletisim' element={<Contact />} />
          <Route exact path='/dashboard/:userId' element={<Dashboard />} />
          <Route exact path="/profile/:userId" element={<Profile />} />
          <Route exact path='/notes/:userId' element={<Notes />} />
          <Route exact path='/test' element={<TestModal />} />
        </Routes>
        <ToastContainer 
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </UserContextProvider>
  )
}

export default App