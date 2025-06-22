import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import AboutPage from './pages/AboutPage'
import Navigation from './components/Navigation'
import FloatingOrbs from './components/FloatingOrbs'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <FloatingOrbs />
      <Navigation />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </motion.main>
    </div>
  )
}

export default App