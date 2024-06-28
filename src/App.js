import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'; 
import HomePage from './pages/HomePage';
import "./App.css";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Notes from './pages/Notes';
import TestModal from './components/TestModal';
import { UserContextProvider } from './context/UserContext';
import Article from './pages/Article';

const App = () => {
  return (
    <UserContextProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/dashboard/:userId' element={<Dashboard />} />
          <Route exact path="/profile/:userId" element={<Profile />} />
          <Route exact path='/notes/:userId' element={<Notes />} />
          <Route exact path='/test/:userId' element={<TestModal />} />
          <Route exact path='/article/:cardId' element={< Article />} />
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