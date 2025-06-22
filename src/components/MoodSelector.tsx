import React from 'react'
import { motion } from 'framer-motion'

interface Mood {
  id: string
  label: string
  icon: React.ElementType
  color: string
}

interface MoodSelectorProps {
  moods: Mood[]
  selectedMood: string
  onMoodSelect: (moodId: string) => void
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ moods, selectedMood, onMoodSelect }) => {
  return (
    <div className="glass-effect rounded-2xl p-4">
      <h3 className="text-white font-medium mb-3 text-center">How are you feeling?</h3>
      <div className="flex justify-center space-x-3">
        {moods.map((mood) => {
          const Icon = mood.icon
          const isSelected = selectedMood === mood.id
          
          return (
            <motion.button
              key={mood.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onMoodSelect(mood.id)}
              className={`flex flex-col items-center space-y-1 p-3 rounded-xl transition-all duration-200 ${
                isSelected
                  ? 'bg-white/20 border-2 border-white/30'
                  : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
              }`}
            >
              <Icon className={`h-6 w-6 ${mood.color}`} />
              <span className="text-white text-xs font-medium">{mood.label}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default MoodSelector