import React from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Brain, 
  Shield, 
  Users, 
  Award, 
  Lightbulb,
  Target,
  Sparkles
} from 'lucide-react'

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: 'Empathy First',
      description: 'Every interaction is designed with genuine care and understanding at its core.',
      color: 'text-red-400'
    },
    {
      icon: Brain,
      title: 'Science-Based',
      description: 'Our approach is grounded in proven psychological principles and mental health research.',
      color: 'text-blue-400'
    },
    {
      icon: Shield,
      title: 'Privacy Protected',
      description: 'Your conversations are completely confidential and secure, always.',
      color: 'text-green-400'
    },
    {
      icon: Users,
      title: 'Inclusive Support',
      description: 'We welcome everyone, regardless of background, identity, or circumstances.',
      color: 'text-purple-400'
    }
  ]

  const features = [
    {
      icon: Target,
      title: 'Personalized Guidance',
      description: 'AI that adapts to your unique needs, personality, and mental health journey.'
    },
    {
      icon: Lightbulb,
      title: 'Practical Strategies',
      description: 'Evidence-based techniques for stress management, emotional regulation, and personal growth.'
    },
    {
      icon: Sparkles,
      title: 'Positive Psychology',
      description: 'Focus on building strengths, resilience, and cultivating lasting happiness.'
    },
    {
      icon: Award,
      title: 'Professional Quality',
      description: 'Developed with mental health professionals to ensure the highest standards of care.'
    }
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl lg:text-6xl font-display font-bold text-white mb-6"
          >
            About <span className="gradient-text">Live Life</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 mb-12 leading-relaxed"
          >
            We believe everyone deserves access to mental wellness support. Our AI video agent 
            combines cutting-edge technology with genuine empathy to provide personalized guidance 
            for stress relief, emotional support, and life coaching.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-display font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                To democratize mental wellness by making high-quality emotional support 
                accessible to everyone, everywhere, at any time. We're breaking down barriers 
                to mental health care through innovative AI technology that truly understands 
                and cares.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Our AI video agent isn't just a chatbot—it's a compassionate companion 
                designed to help you navigate life's challenges with greater resilience, 
                self-awareness, and joy.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass-effect p-8 rounded-3xl">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Mental Wellness for All
                  </h3>
                  <p className="text-gray-300">
                    Breaking down barriers to mental health support through 
                    innovative AI technology and genuine human empathy.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-white mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              These principles guide everything we do, from product development 
              to user interactions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-effect p-6 rounded-2xl text-center hover:bg-white/10 transition-all duration-300"
                >
                  <div className={`w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`h-8 w-8 ${value.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              )
            })}
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
            <h2 className="text-4xl font-display font-bold text-white mb-6">
              What Makes Us Different
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our AI video agent combines advanced technology with human-centered design 
              to deliver truly personalized mental wellness support.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-effect p-8 rounded-2xl hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
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
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Experience the future of mental wellness support. Your AI companion 
              is ready to help you live life with greater purpose, peace, and positivity.
            </p>
            <motion.a
              href="/chat"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-10 py-5 rounded-full font-semibold text-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/25"
            >
              Begin Your Conversation
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage