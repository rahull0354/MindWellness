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
      <div className="bg-white dark:bg-violet-950/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-violet-200 dark:border-purple-500/50">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePrevMonth}
            className="w-10 h-10 bg-violet-100 dark:bg-purple-900/40 hover:bg-violet-500 hover:text-white dark:hover:bg-violet-600 rounded-xl transition-colors duration-300 text-lg border border-violet-200 dark:border-purple-500/50"
          >
            ‹
          </button>
          <span className="text-xl font-semibold text-gray-700 dark:text-white">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={handleNextMonth}
            className="w-10 h-10 bg-violet-100 dark:bg-purple-900/40 hover:bg-violet-500 hover:text-white dark:hover:bg-violet-600 rounded-xl transition-colors duration-300 text-lg border border-violet-200 dark:border-purple-500/50"
          >
            ›
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {days.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-purple-200 py-2">
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
                    ? 'border-2 border-fuchsia-400 bg-fuchsia-100 dark:bg-fuchsia-900/70 shadow-sm'
                    : 'bg-purple-100 dark:bg-purple-900/40 hover:bg-violet-100 dark:hover:bg-purple-900/60 hover:scale-105 border border-purple-200 dark:border-purple-500/50'
                }`}
              >
                {date ? (
                  <>
                    <span className="text-sm">{date.getDate()}</span>
                    {dayData?.mood && (
                      <span className="text-xl">{getMoodEmoji(dayData.mood.mood)}</span>
                    )}
                    {dayData?.entry && (
                      <div className="absolute bottom-1 w-1.5 h-1.5 bg-fuchsia-500 rounded-full"></div>
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
        <div className="bg-white dark:bg-violet-950/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-violet-200 dark:border-purple-500/50">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
            {selectedDay.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h2>

          {selectedDayData.mood && (
            <div className="mb-4">
              <p className="text-gray-600 dark:text-purple-200 mb-2">Mood:</p>
              <span className="text-4xl">{getMoodEmoji(selectedDayData.mood.mood)}</span>
            </div>
          )}

          {selectedDayData.entry ? (
            <div>
              <p className="text-gray-600 dark:text-purple-200 mb-2">Journal Entry:</p>
              <p className="text-gray-700 dark:text-purple-100 whitespace-pre-wrap bg-violet-100 dark:bg-purple-900/40 p-4 rounded-xl border border-violet-200 dark:border-purple-500/50">
                {selectedDayData.entry.text}
              </p>
            </div>
          ) : (
            <p className="text-gray-400 dark:text-purple-300 italic">No journal entry for this day.</p>
          )}

          <button
            onClick={() => setSelectedDay(null)}
            className="mt-4 text-fuchsia-600 hover:text-fuchsia-700 dark:text-fuchsia-400 dark:hover:text-fuchsia-300 font-medium transition-colors duration-300"
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}

export default CalendarSection
