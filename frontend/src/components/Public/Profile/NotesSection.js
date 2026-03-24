import React from 'react';
import { motion } from 'framer-motion';
import { StickyNote, Pin, Sparkles } from 'lucide-react';

const HIGHLIGHT_STYLES = {
  yellow: {
    bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
    border: 'border-yellow-300',
    accent: 'bg-yellow-400',
    text: 'text-yellow-900',
    icon: 'text-yellow-600',
    shadow: 'shadow-yellow-100',
  },
  green: {
    bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
    border: 'border-green-300',
    accent: 'bg-green-400',
    text: 'text-green-900',
    icon: 'text-green-600',
    shadow: 'shadow-green-100',
  },
  blue: {
    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    border: 'border-blue-300',
    accent: 'bg-blue-400',
    text: 'text-blue-900',
    icon: 'text-blue-600',
    shadow: 'shadow-blue-100',
  },
  pink: {
    bg: 'bg-gradient-to-br from-pink-50 to-rose-50',
    border: 'border-pink-300',
    accent: 'bg-pink-400',
    text: 'text-pink-900',
    icon: 'text-pink-600',
    shadow: 'shadow-pink-100',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
    border: 'border-purple-300',
    accent: 'bg-purple-400',
    text: 'text-purple-900',
    icon: 'text-purple-600',
    shadow: 'shadow-purple-100',
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
    border: 'border-orange-300',
    accent: 'bg-orange-400',
    text: 'text-orange-900',
    icon: 'text-orange-600',
    shadow: 'shadow-orange-100',
  },
};

const NotesSection = ({ notes = [], section = null, isAdminPreview = false }) => {
  // Filter notes by section if specified, otherwise show all
  const filteredNotes = section
    ? notes.filter(note => note.section === section || note.section === 'general')
    : notes;

  if (!filteredNotes || filteredNotes.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <div className={`${isAdminPreview ? 'w-full' : 'max-w-6xl mx-auto'} px-6`}>
        {/* Section Header - only show for general notes display */}
        {!section && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg shadow-amber-500/30 mb-4"
            >
              <StickyNote className="w-7 h-7 text-white" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              Notes & <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Highlights</span>
            </h2>
            <p className="text-gray-500">Important information and updates</p>
          </motion.div>
        )}

        {/* Notes Grid */}
        <div className={section ? 'space-y-4' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'}>
          {filteredNotes.map((note, index) => {
            const style = HIGHLIGHT_STYLES[note.highlight_color] || HIGHLIGHT_STYLES.yellow;

            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20, rotate: -1 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  rotate: 1,
                  transition: { duration: 0.2 }
                }}
                className={`relative ${style.bg} ${style.border} border-2 rounded-xl p-5 shadow-lg ${style.shadow} overflow-hidden`}
              >
                {/* Decorative corner fold */}
                <div className="absolute -top-1 -right-1 w-8 h-8">
                  <div className={`absolute bottom-0 left-0 w-full h-full ${style.accent} opacity-30`}
                       style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }} />
                </div>

                {/* Pin indicator */}
                {note.is_pinned && (
                  <div className="absolute -top-1 left-4">
                    <div className={`w-6 h-8 ${style.accent} rounded-b-full flex items-center justify-center shadow-md`}>
                      <Pin className="w-3 h-3 text-white -rotate-45" />
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className={note.is_pinned ? 'pt-2' : ''}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg ${style.accent} bg-opacity-20 flex items-center justify-center flex-shrink-0`}>
                      <Sparkles className={`w-4 h-4 ${style.icon}`} />
                    </div>
                    <div>
                      <h3 className={`font-bold ${style.text} text-lg leading-tight`}>
                        {note.title}
                      </h3>
                      {!section && note.section !== 'general' && (
                        <span className="text-xs text-gray-500 capitalize mt-0.5 inline-block">
                          {note.section}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className={`${style.text} text-sm leading-relaxed whitespace-pre-wrap opacity-90`}>
                    {note.content}
                  </p>
                </div>

                {/* Tape decoration */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/60 rounded-sm transform -rotate-2 shadow-sm" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Inline note card for displaying within sections
export const InlineNote = ({ note }) => {
  if (!note) return null;

  const style = HIGHLIGHT_STYLES[note.highlight_color] || HIGHLIGHT_STYLES.yellow;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`${style.bg} ${style.border} border-l-4 rounded-r-lg p-4 my-4`}
    >
      <div className="flex items-start gap-2">
        <Sparkles className={`w-5 h-5 ${style.icon} flex-shrink-0 mt-0.5`} />
        <div>
          <h4 className={`font-semibold ${style.text} mb-1`}>{note.title}</h4>
          <p className={`text-sm ${style.text} opacity-80`}>{note.content}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default NotesSection;
