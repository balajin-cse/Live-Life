import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Brain, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  Play,
  Users,
  Clock,
  Award
} from 'lucide-react'
import VideoPreview from '../components/VideoPreview'
import FeatureCard from '../components/FeatureCard'
import StatCard from '../components/StatCard'

const HomePage = () => {
  const features = [
    {
      icon: Heart,
      title: 'Emotional Support',
      description: 'Get personalized emotional guidance and support through AI-powered conversations that understand your unique needs.',
      color: 'text-red-400'
    },
    {
      icon: Brain,
      title: 'Mental Wellness',
      description: 'Access evidence-based mental health techniques and mindfulness practices tailored to your current state of mind.',
      color: 'text-blue-400'
    },
    {
      icon: Shield,
      title: 'Safe Space',
      description: 'Experience judgment-free conversations in a secure environment designed to protect your privacy and wellbeing.',
      color: 'text-green-400'
    },
    {
      icon: Sparkles,
      title: 'Life Guidance',
      description: 'Receive practical advice and strategies for living a more positive, fulfilling life with purpose and meaning.',
      color: 'text-purple-400'
    }
  ]

  const stats = [
    { icon: Users, value: '10K+', label: 'Lives Touched' },
    { icon: Clock, value: '24/7', label: 'Always Available' },
    { icon: Award, value: '95%', label: 'Satisfaction Rate' },
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight"
            >
              Live Life with
              <span className="gradient-text block">Purpose & Joy</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Meet your AI companion for mental wellness. Get personalized support, 
              stress relief, and life guidance through face-to-face conversations that 
              understand and care about your wellbeing.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/chat"
                className="group bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/25 flex items-center justify-center space-x-2"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="group glass-effect text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-white/20 flex items-center justify-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Watch Demo</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Right Content - Video Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <VideoPreview />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <StatCard {...stat} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              Why Choose <span className="gradient-text">Live Life</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of mental wellness with our AI video agent that provides 
              personalized, empathetic support whenever you need it most.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-effect p-12 rounded-3xl"
          >
            <h2 className="text-4xl font-display font-bold text-white mb-6">
              Ready to Transform Your Life?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands who have found peace, purpose, and positivity through 
              our AI-powered mental wellness platform.
            </p>
            <Link
              to="/chat"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-10 py-5 rounded-full font-semibold text-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/25 group"
            >
              <span>Begin Your Journey</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage