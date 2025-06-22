import React from 'react'
import { motion } from 'framer-motion'

const FloatingOrbs = () => {
  const orbs = [
    { size: 'w-64 h-64', color: 'bg-primary-500/20', delay: 0, x: '10%', y: '20%' },
    { size: 'w-48 h-48', color: 'bg-secondary-500/20', delay: 2, x: '80%', y: '60%' },
    { size: 'w-32 h-32', color: 'bg-accent-500/20', delay: 4, x: '60%', y: '10%' },
    { size: 'w-40 h-40', color: 'bg-primary-400/15', delay: 1, x: '20%', y: '80%' },
    { size: 'w-56 h-56', color: 'bg-secondary-400/15', delay: 3, x: '90%', y: '30%' },
  ]

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className={`floating-orb ${orb.size} ${orb.color}`}
          style={{
            left: orb.x,
            top: orb.y,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export default FloatingOrbs