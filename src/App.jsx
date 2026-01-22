import { useState, useEffect } from 'react'
import CalendarSection from './components/CalendarSection'
import QuoteCard from './components/QuoteCard'

// Mood options with emojis
const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'calm', emoji: '😌', label: 'Calm' },
  { id: 'neutral', emoji: '😐', label: 'Neutral' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'stressed', emoji: '😰', label: 'Stressed' },
  { id: 'anxious', emoji: '😟', label: 'Anxious' },
  { id: 'excited', emoji: '🤩', label: 'Excited' },
  { id: 'grateful', emoji: '🙏', label: 'Grateful' },
]

// Tags for entries
const TAGS = [
  { id: 'grateful', label: '🌟 Grateful' },
  { id: 'stressful', label: '🤔 Stressful' },
  { id: 'productive', label: '✨ Productive' },
  { id: 'reflective', label: '💪 Reflective' },
  { id: 'peaceful', label: '☮️ Peaceful' },
  { id: 'challenging', label: '🔥 Challenging' },
]

// Simplified Journal Entry Form Component
function JournalEntryForm({ moods, tags, onSaveEntry }) {
  const [text, setText] = useState('')
  const [selectedMood, setSelectedMood] = useState(null)
  const [selectedTags, setSelectedTags] = useState([])

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    )
  }

  const handleSave = () => {
    if (!text.trim()) return
    onSaveEntry({ text: text.trim(), mood: selectedMood, tags: selectedTags })
    setText('')
    setSelectedMood(null)
    setSelectedTags([])
  }

  return (
    <div className="space-y-4">
      {/* Mood Selector */}
      <div>
        <p className="text-gray-500 dark:text-purple-200 text-sm mb-2">Add how you're feeling:</p>
        <div className="flex flex-wrap gap-2">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              title={mood.label}
              className={`w-10 h-10 text-xl rounded-lg border-2 transition-all duration-300 hover:scale-110 ${
                selectedMood === mood.id
                  ? 'border-fuchsia-500 bg-fuchsia-100 dark:bg-fuchsia-900/70'
                  : 'border-transparent bg-violet-100 dark:bg-purple-900/40 hover:bg-purple-100 dark:hover:bg-purple-900/60'
              }`}
            >
              {mood.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <p className="text-gray-500 dark:text-purple-200 text-sm mb-2">Tags:</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagToggle(tag.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-300 text-sm ${
                selectedTags.includes(tag.id)
                  ? 'bg-linear-to-r from-violet-500 to-fuchsia-500 dark:from-violet-600 dark:to-fuchsia-600 text-white'
                  : 'bg-violet-100 dark:bg-purple-900/40 text-gray-600 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-900/60'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text Area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your thoughts..."
        className="w-full min-h-40 p-4 rounded-xl border-2 border-violet-200 dark:border-purple-500/50 bg-violet-50 dark:bg-purple-900/30 text-gray-800 dark:text-white focus:outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100 dark:focus:ring-fuchsia-900/50 transition-all duration-300 resize-y"
      />

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-linear-to-r from-violet-500 via-purple-500 to-fuchsia-500 dark:from-violet-600 dark:via-purple-700 dark:to-fuchsia-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-md active:scale-[0.98]"
      >
        Save to Journal ✨
      </button>
    </div>
  )
}

// Memory Card Component
function MemoryCard({ entry, moods, tags, onDelete }) {
  const getMoodEmoji = (moodId) => moods.find(m => m.id === moodId)?.emoji || ''

  return (
    <div className="bg-violet-50 dark:bg-purple-900/30 p-4 rounded-xl border-l-4 border-fuchsia-400 hover:shadow-sm transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-gray-500 dark:text-purple-300">
          {entry.localDate}
        </span>
        <div className="flex items-center gap-2">
          {entry.mood && <span className="text-xl">{getMoodEmoji(entry.mood)}</span>}
          <button
            onClick={() => onDelete(entry.id)}
            className="text-rose-400 hover:text-rose-600 dark:text-rose-300 text-sm transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
      {entry.tags && entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {entry.tags.map((tagId) => {
            const tag = tags.find(t => t.id === tagId)
            return tag ? (
              <span key={tagId} className="bg-fuchsia-100 dark:bg-fuchsia-900/70 text-fuchsia-700 dark:text-fuchsia-300 px-2 py-0.5 rounded text-xs">
                {tag.label}
              </span>
            ) : null
          })}
        </div>
      )}
      <p className="text-gray-700 dark:text-purple-100 text-sm whitespace-pre-wrap">{entry.text}</p>
    </div>
  )
}

// Weekly Mood Component
function WeeklyMood({ moodHistory, moods }) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date()
  const weekData = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const dateStr = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })

    const dayMood = moodHistory.find(m => {
      const moodDate = new Date(m.date)
      return moodDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }) === dateStr
    })

    weekData.push({
      day: days[date.getDay()],
      mood: dayMood?.mood || null
    })
  }

  const getMoodEmoji = (moodId) => moods.find(m => m.id === moodId)?.emoji || ''

  return (
    <div className="grid grid-cols-7 gap-2">
      {weekData.map((day, index) => (
        <div
          key={index}
          className="bg-purple-100 dark:bg-purple-900/40 p-2 rounded-lg text-center hover:bg-fuchsia-100 dark:hover:bg-purple-900/60 transition-colors duration-300 border border-purple-200 dark:border-purple-500/50"
        >
          <span className="block text-xs font-medium text-gray-500 dark:text-purple-300 mb-1">
            {day.day}
          </span>
          {day.mood ? (
            <span className="text-xl">{getMoodEmoji(day.mood)}</span>
          ) : (
            <span className="text-gray-400 dark:text-purple-400 text-sm">—</span>
          )}
        </div>
      ))}
    </div>
  )
}

// Quick Insights Component
function QuickInsights({ moodHistory, entries, moods }) {
  const getInsights = () => {
    if (moodHistory.length === 0) {
      return [{ icon: '💭', text: 'Start tracking your mood to see insights!' }]
    }

    const moodScores = {
      happy: 5, grateful: 5, excited: 5,
      calm: 4, neutral: 3, sad: 2,
      anxious: 1, stressed: 1,
    }

    const recentMoods = moodHistory.slice(0, 7)
    const avgScore = recentMoods.reduce((sum, m) => sum + (moodScores[m.mood] || 3), 0) / recentMoods.length

    const insights = []

    if (avgScore >= 4) {
      insights.push({ icon: '🌟', text: 'You\'ve had a wonderful week!' })
    } else if (avgScore <= 2) {
      insights.push({ icon: '💙', text: 'Tough week. You\'ve got this!' })
    } else {
      insights.push({ icon: '⚖️', text: 'Balanced week overall' })
    }

    const mostCommon = moods.reduce((max, mood) => {
      const count = moodHistory.filter(m => m.mood === mood.id).length
      return count > max.count ? { mood, count } : max
    }, { mood: null, count: 0 })

    if (mostCommon.mood) {
      insights.push({ icon: '📊', text: `Mostly ${mostCommon.mood.emoji} lately` })
    }

    return insights
  }

  const insights = getInsights()

  return (
    <div className="space-y-2">
      {insights.map((insight, index) => (
        <div
          key={index}
          className="bg-fuchsia-100 dark:bg-purple-900/40 p-3 rounded-lg border-l-4 border-fuchsia-400"
        >
          <span className="text-lg mr-1">{insight.icon}</span>
          <span className="text-sm text-gray-700 dark:text-purple-100">{insight.text}</span>
        </div>
      ))}
    </div>
  )
}

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [entries, setEntries] = useState([])
  const [moodHistory, setMoodHistory] = useState([])
  const [showCalendar, setShowCalendar] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries')
    const savedMoods = localStorage.getItem('moodHistory')
    const savedTheme = localStorage.getItem('darkMode')

    if (savedEntries) setEntries(JSON.parse(savedEntries))
    if (savedMoods) setMoodHistory(JSON.parse(savedMoods))
    if (savedTheme) setDarkMode(JSON.parse(savedTheme))
  }, [])

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries))
  }, [entries])

  // Save mood history to localStorage
  useEffect(() => {
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory))
  }, [moodHistory])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  const handleSaveEntry = (entry) => {
    const now = new Date()
    const newEntry = {
      id: Date.now(),
      date: now.toISOString(),
      localDate: now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      ...entry
    }
    setEntries([newEntry, ...entries])

    // Also save to mood history if mood is selected
    if (entry.mood) {
      const moodEntry = {
        mood: entry.mood,
        date: now.toISOString(),
        localDate: now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
      setMoodHistory([moodEntry, ...moodHistory])
    }
  }

  const handleSaveMood = (mood) => {
    const now = new Date()
    const todayStr = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })

    // Check if mood already exists for today
    const existingIndex = moodHistory.findIndex(m => {
      const moodDate = new Date(m.date)
      return moodDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }) === todayStr
    })

    const moodEntry = {
      mood,
      date: now.toISOString(),
      localDate: now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    if (existingIndex !== -1) {
      // Replace existing mood for today
      const updatedMoodHistory = [...moodHistory]
      updatedMoodHistory[existingIndex] = moodEntry
      setMoodHistory(updatedMoodHistory)
    } else {
      // Add new mood entry
      setMoodHistory([moodEntry, ...moodHistory])
    }
  }

  const handleDeleteEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id))
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode
        ? 'bg-linear-to-br from-violet-950 via-purple-950 to-fuchsia-950'
        : 'bg-linear-to-br from-violet-50 via-purple-50 to-fuchsia-50'
    }`}>
      <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-linear-to-r from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
              My Journal
            </h1>
            <p className="text-gray-500 dark:text-purple-300 mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="bg-linear-to-r from-violet-500 to-fuchsia-500 dark:from-violet-600 dark:to-fuchsia-600 hover:from-violet-600 hover:to-fuchsia-600 dark:hover:from-violet-700 dark:hover:to-fuchsia-700 text-white p-3 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Writing */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Mood Check-in */}
            <div className="bg-white dark:bg-violet-950/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-violet-200 dark:border-purple-500/50">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
                How are you feeling right now?
              </h2>
              <div className="flex flex-wrap gap-3">
                {MOODS.map((mood) => {
                  const todayMood = moodHistory.find(m => {
                    const moodDate = new Date(m.date)
                    const today = new Date()
                    return moodDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    }) === today.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    }) && m.mood === mood.id
                  })

                  return (
                    <button
                      key={mood.id}
                      onClick={() => handleSaveMood(mood.id)}
                      title={mood.label}
                      className={`w-14 h-14 text-2xl rounded-xl border-2 transition-all duration-300 hover:scale-110 hover:shadow-sm ${
                        todayMood
                          ? 'border-fuchsia-500 bg-fuchsia-100 dark:bg-fuchsia-900/70 shadow-sm'
                          : 'border-transparent bg-violet-100 dark:bg-purple-900/40 hover:bg-purple-100 dark:hover:bg-purple-900/60'
                      }`}
                    >
                      {mood.emoji}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Journal Entry */}
            <div className="bg-white dark:bg-violet-950/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-violet-200 dark:border-purple-500/50">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">What's on your mind?</h2>
              <JournalEntryForm
                moods={MOODS}
                tags={TAGS}
                onSaveEntry={handleSaveEntry}
              />
            </div>

            {/* Recent Memories */}
            <div className="bg-white dark:bg-violet-950/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-violet-200 dark:border-purple-500/50">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Recent Memories</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {entries.length === 0 ? (
                  <p className="text-gray-400 dark:text-purple-300 text-center py-8">
                    Your memories will appear here. Start writing!
                  </p>
                ) : (
                  entries.slice(0, 5).map((entry) => (
                    <MemoryCard
                      key={entry.id}
                      entry={entry}
                      moods={MOODS}
                      tags={TAGS}
                      onDelete={handleDeleteEntry}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Insights */}
          <div className="space-y-6">
            {/* Daily Inspiration */}
            <QuoteCard />

            {/* This Week's Mood */}
            <div className="bg-white dark:bg-violet-950/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-violet-200 dark:border-purple-500/50">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">This Week's Journey</h2>
              <WeeklyMood moodHistory={moodHistory} moods={MOODS} />
            </div>

            {/* Quick Insights */}
            <div className="bg-white dark:bg-violet-950/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-violet-200 dark:border-purple-500/50">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Insights</h2>
              <QuickInsights moodHistory={moodHistory} entries={entries} moods={MOODS} />
            </div>

            {/* View Calendar Button */}
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full bg-linear-to-r from-violet-100 to-purple-100 dark:from-purple-900/40 dark:to-fuchsia-900/40 hover:from-violet-200 hover:to-purple-200 dark:hover:from-purple-900/60 dark:hover:to-fuchsia-900/60 border border-violet-200 dark:border-purple-500/50 text-gray-700 dark:text-purple-200 font-medium py-3 px-4 rounded-xl transition-all duration-300"
            >
              {showCalendar ? '📅 Hide Calendar' : '📅 View Calendar'}
            </button>

            {showCalendar && (
              <div className="bg-white dark:bg-violet-950/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-violet-200 dark:border-purple-500/50">
                <CalendarSection entries={entries} moodHistory={moodHistory} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
