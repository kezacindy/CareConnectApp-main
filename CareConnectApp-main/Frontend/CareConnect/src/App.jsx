// App.jsx
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'  // Import the routes from AppRoutes
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />  
      </AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  )
}

export default App