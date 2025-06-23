import React from 'react';
import { motion } from 'framer-motion';
import { User, Brain, Heart, Sparkles, ChevronDown } from 'lucide-react';
import { TavusPersona } from '../services/tavusService';

interface PersonaSelectorProps {
  personas: TavusPersona[];
  selectedPersona: TavusPersona | null;
  onPersonaSelect: (persona: TavusPersona) => void;
  isLoading?: boolean;
  error?: string | null;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  personas,
  selectedPersona,
  onPersonaSelect,
  isLoading = false,
  error = null
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const getPersonaIcon = (personaName: string) => {
    const name = personaName.toLowerCase();
    if (name.includes('therapist') || name.includes('counselor')) return Brain;
    if (name.includes('coach') || name.includes('mentor')) return Sparkles;
    if (name.includes('support') || name.includes('care')) return Heart;
    return User;
  };

  const getPersonaColor = (index: number) => {
    const colors = [
      'from-blue-500 to-purple-500',
      'from-green-500 to-teal-500',
      'from-pink-500 to-rose-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-blue-500',
    ];
    return colors[index % colors.length];
  };

  if (error) {
    return (
      <div className="glass-effect rounded-2xl p-4">
        <div className="text-center text-red-400">
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="glass-effect rounded-2xl p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-400 mx-auto mb-2"></div>
          <p className="text-white text-sm">Loading therapy personas...</p>
        </div>
      </div>
    );
  }

  if (personas.length === 0) {
    return (
      <div className="glass-effect rounded-2xl p-4">
        <div className="text-center text-gray-400">
          <User className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">No therapy personas available</p>
          <p className="text-xs mt-1">Please check your Tavus account setup</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-2xl p-4">
      <h3 className="text-white font-medium mb-3 text-center">Choose Your Therapy Companion</h3>
      
      {/* Selected Persona Display */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full glass-effect rounded-xl p-3 flex items-center justify-between hover:bg-white/10 transition-all duration-200"
        >
          {selectedPersona ? (
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getPersonaColor(personas.findIndex(p => p.persona_id === selectedPersona.persona_id))} flex items-center justify-center`}>
                {React.createElement(getPersonaIcon(selectedPersona.persona_name), {
                  className: "h-5 w-5 text-white"
                })}
              </div>
              <div className="text-left">
                <p className="text-white font-medium text-sm">{selectedPersona.persona_name}</p>
                <p className="text-gray-400 text-xs">AI Therapy Companion</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-left">
                <p className="text-gray-400 font-medium text-sm">Select a persona</p>
                <p className="text-gray-500 text-xs">Choose your therapy companion</p>
              </div>
            </div>
          )}
          
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </motion.button>

        {/* Dropdown Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 glass-effect rounded-xl border border-white/20 z-50 max-h-60 overflow-y-auto"
          >
            {personas.map((persona, index) => {
              const Icon = getPersonaIcon(persona.persona_name);
              const isSelected = selectedPersona?.persona_id === persona.persona_id;
              
              return (
                <motion.button
                  key={persona.persona_id}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  onClick={() => {
                    onPersonaSelect(persona);
                    setIsOpen(false);
                  }}
                  className={`w-full p-3 flex items-center space-x-3 text-left transition-all duration-200 first:rounded-t-xl last:rounded-b-xl ${
                    isSelected ? 'bg-white/10 border-l-2 border-primary-400' : 'hover:bg-white/5'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getPersonaColor(index)} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{persona.persona_name}</p>
                    <p className="text-gray-400 text-xs">AI Therapy Companion</p>
                    {persona.context && (
                      <p className="text-gray-500 text-xs mt-1 line-clamp-2">{persona.context}</p>
                    )}
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-primary-400 flex-shrink-0"></div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Persona Description */}
      {selectedPersona && selectedPersona.system_prompt && (
        <div className="mt-3 p-3 bg-white/5 rounded-lg">
          <p className="text-gray-300 text-xs leading-relaxed">
            {selectedPersona.system_prompt.length > 150 
              ? `${selectedPersona.system_prompt.substring(0, 150)}...`
              : selectedPersona.system_prompt
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default PersonaSelector;