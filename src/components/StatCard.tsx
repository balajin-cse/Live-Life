import React from 'react'
import { motion } from 'framer-motion'

interface StatCardProps {
  icon: React.ElementType
  value: string
  label: string
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="glass-effect p-8 rounded-2xl text-center hover:bg-white/10 transition-all duration-300"
    >
      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-4">
        <Icon className="h-8 w-8 text-white" />
      </div>
      <div className="text-4xl font-bold text-white mb-2">{value}</div>
      <div className="text-gray-300 font-medium">{label}</div>
    </motion.div>
  )
}

export default StatCard