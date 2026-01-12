import { useState } from 'react'

function MoodSection({ moods, moodHistory, onSaveMood }) {
  const [lastSavedMood, setLastSavedMood] = useState(null)

  const handleMoodClick = (moodId) => {
    onSaveMood(moodId)
    setLastSavedMood(moodId)
  }

  // Get this week's moods
  const getWeekMoods = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date()
    const weekData = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      const dayMood = moodHistory.find(m => m.date.startsWith(dateStr))
      weekData.push({
        day: days[date.getDay()],
        mood: dayMood?.mood || null
      })
    }

    return weekData
  }

  const weekMoods = getWeekMoods()

  const getMoodEmoji = (moodId) => {
    return moods.find(m => m.id === moodId)?.emoji || ''
  }

  return (
    <div className="space-y-6">
      {/* Quick Mood Check-in */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Quick Mood Check-in</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => handleMoodClick(mood.id)}
              className="bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900 p-4 rounded-lg transition-all hover:scale-105 hover:shadow-md flex flex-col items-center gap-2"
            >
              <span className="text-4xl">{mood.emoji}</span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{mood.label}</span>
            </button>
          ))}
        </div>
        {lastSavedMood && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4 italic">
            Mood saved: {getMoodEmoji(lastSavedMood)} {moods.find(m => m.id === lastSavedMood)?.label}
          </p>
        )}
      </div>

      {/* Weekly Mood Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">This Week's Moods</h2>
        <div className="grid grid-cols-7 gap-2">
          {weekMoods.map((day, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
            >
              <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                {day.day}
              </span>
              {day.mood ? (
                <span className="text-2xl">{getMoodEmoji(day.mood)}</span>
              ) : (
                <span className="text-2xl text-gray-400 opacity-50">—</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MoodSection
