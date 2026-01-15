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

      // Compare local dates by formatting both to local date strings
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

    return weekData
  }

  const weekMoods = getWeekMoods()

  const getMoodEmoji = (moodId) => {
    return moods.find(m => m.id === moodId)?.emoji || ''
  }

  return (
    <div className="space-y-6">
      {/* Quick Mood Check-in */}
      <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-sage-100 dark:border-sage-800/30">
        <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-100 mb-6">Quick Mood Check-in</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => handleMoodClick(mood.id)}
              className="bg-sage-50 dark:bg-gray-700/50 hover:bg-sage-100 dark:hover:bg-sage-900/30 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-sm flex flex-col items-center gap-2"
            >
              <span className="text-4xl">{mood.emoji}</span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-300">{mood.label}</span>
            </button>
          ))}
        </div>
        {lastSavedMood && (
          <p className="text-center text-gray-400 dark:text-gray-400 mt-4 italic">
            Mood saved: {getMoodEmoji(lastSavedMood)} {moods.find(m => m.id === lastSavedMood)?.label}
          </p>
        )}
      </div>

      {/* Weekly Mood Summary */}
      <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-sage-100 dark:border-sage-800/30">
        <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-100 mb-6">This Week's Moods</h2>
        <div className="grid grid-cols-7 gap-2">
          {weekMoods.map((day, index) => (
            <div
              key={index}
              className="bg-sage-50 dark:bg-gray-700/50 p-3 rounded-xl text-center hover:bg-sage-100 dark:hover:bg-sage-900/30 transition-colors duration-300"
            >
              <span className="block text-xs font-medium text-gray-400 dark:text-gray-400 mb-2">
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
