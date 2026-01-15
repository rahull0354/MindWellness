import { useState, useMemo } from 'react'

function CalendarSection({ entries, moodHistory }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)

  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const getDayData = (date) => {
    if (!date) return null

    // Compare local dates by formatting both to local date strings
    const dateStr = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })

    const entry = entries.find(e => {
      const entryDate = new Date(e.date)
      return entryDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }) === dateStr
    })

    const mood = moodHistory.find(m => {
      const moodDate = new Date(m.date)
      return moodDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }) === dateStr
    })

    return { entry, mood }
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDayClick = (date) => {
    if (!date) return
    setSelectedDay(date)
  }

  const getMoodEmoji = (moodId) => {
    const moodEmojis = {
      happy: '😊', calm: '😌', neutral: '😐', sad: '😢',
      stressed: '😰', anxious: '😟', excited: '🤩', grateful: '🙏'
    }
    return moodEmojis[moodId] || ''
  }

  const daysArray = getDaysInMonth(currentDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const selectedDayData = selectedDay ? getDayData(selectedDay) : null

  return (
    <div className="space-y-6">
      {/* Calendar Card */}
      <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-sage-100 dark:border-sage-800/30">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePrevMonth}
            className="w-10 h-10 bg-sage-50 dark:bg-gray-700/50 hover:bg-sage-400 hover:text-white dark:hover:bg-sage-600 rounded-xl transition-colors duration-300 text-lg"
          >
            ‹
          </button>
          <span className="text-xl font-semibold text-gray-600 dark:text-gray-100">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={handleNextMonth}
            className="w-10 h-10 bg-sage-50 dark:bg-gray-700/50 hover:bg-sage-400 hover:text-white dark:hover:bg-sage-600 rounded-xl transition-colors duration-300 text-lg"
          >
            ›
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {days.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-400 dark:text-gray-200 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {daysArray.map((date, index) => {
            const dayData = getDayData(date)
            const isToday = date && date.getTime() === today.getTime()

            return (
              <button
                key={index}
                onClick={() => handleDayClick(date)}
                disabled={!date}
                className={`aspect-square p-2 rounded-xl transition-all duration-300 flex flex-col items-center justify-center relative ${
                  !date
                    ? 'pointer-events-none'
                    : isToday
                    ? 'border-2 border-sage-400 bg-sage-100 dark:bg-sage-900/50 shadow-sm'
                    : 'bg-sage-50 dark:bg-gray-700/50 hover:bg-sage-100 dark:hover:bg-sage-900/30 hover:scale-105'
                }`}
              >
                {date ? (
                  <>
                    <span className="text-sm">{date.getDate()}</span>
                    {dayData?.mood && (
                      <span className="text-xl">{getMoodEmoji(dayData.mood.mood)}</span>
                    )}
                    {dayData?.entry && (
                      <div className="absolute bottom-1 w-1.5 h-1.5 bg-sage-500 rounded-full"></div>
                    )}
                  </>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDayData && (
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-sage-100 dark:border-sage-800/30">
          <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-100 mb-4">
            {selectedDay.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h2>

          {selectedDayData.mood && (
            <div className="mb-4">
              <p className="text-gray-500 dark:text-gray-200 mb-2">Mood:</p>
              <span className="text-4xl">{getMoodEmoji(selectedDayData.mood.mood)}</span>
            </div>
          )}

          {selectedDayData.entry ? (
            <div>
              <p className="text-gray-500 dark:text-gray-200 mb-2">Journal Entry:</p>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap bg-sage-50/70 dark:bg-gray-700/40 p-4 rounded-xl">
                {selectedDayData.entry.text}
              </p>
            </div>
          ) : (
            <p className="text-gray-400 dark:text-gray-400 italic">No journal entry for this day.</p>
          )}

          <button
            onClick={() => setSelectedDay(null)}
            className="mt-4 text-sage-600 hover:text-sage-700 dark:text-sage-400 dark:hover:text-sage-300 font-medium transition-colors duration-300"
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}

export default CalendarSection
