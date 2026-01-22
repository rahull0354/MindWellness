import { useState, useEffect } from 'react'
import Header from './components/Header'
import Navigation from './components/Navigation'
import JournalSection from './components/JournalSection'
import MoodSection from './components/MoodSection'
import CalendarSection from './components/CalendarSection'
import TrendsSection from './components/TrendsSection'
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

function App() {
  const [activeTab, setActiveTab] = useState('journal')
  const [darkMode, setDarkMode] = useState(false)
  const [entries, setEntries] = useState([])
  const [moodHistory, setMoodHistory] = useState([])

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
        ? 'bg-gradient-to-br from-violet-950 via-purple-950 to-fuchsia-950'
        : 'bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        {/* Header */}
        <Header darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Main Section */}
          <div className="lg:col-span-3">
            {/* Navigation */}
            <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'journal' && (
                <JournalSection
                  entries={entries}
                  moods={MOODS}
                  tags={TAGS}
                  onSaveEntry={handleSaveEntry}
                  onDeleteEntry={handleDeleteEntry}
                />
              )}

              {activeTab === 'mood' && (
                <MoodSection
                  moods={MOODS}
                  moodHistory={moodHistory}
                  onSaveMood={handleSaveMood}
                />
              )}

              {activeTab === 'calendar' && (
                <CalendarSection entries={entries} moodHistory={moodHistory} />
              )}

              {activeTab === 'trends' && (
                <TrendsSection moodHistory={moodHistory} entries={entries} moods={MOODS} />
              )}
            </div>
          </div>

          {/* Sidebar - Quote */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <QuoteCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
