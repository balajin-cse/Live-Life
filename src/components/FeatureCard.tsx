import React from 'react'
import { motion } from 'framer-motion'

interface FeatureCardProps {
  icon: React.ElementType
  title: string
  description: string
  color: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, color }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-effect p-6 rounded-2xl text-center hover:bg-white/10 transition-all duration-300 group"
    >
      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-all duration-300">
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
    </motion.div>
  )
}

export default FeatureCard