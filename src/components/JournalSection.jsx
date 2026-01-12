import { useState } from 'react'

function JournalSection({ entries, moods, tags, onSaveEntry, onDeleteEntry }) {
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

    onSaveEntry({
      text: text.trim(),
      mood: selectedMood,
      tags: selectedTags
    })

    setText('')
    setSelectedMood(null)
    setSelectedTags([])
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMoodEmoji = (moodId) => {
    return moods.find(m => m.id === moodId)?.emoji || ''
  }

  return (
    <div className="space-y-6">
      {/* Journal Entry Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Today's Journal Entry</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>

        {/* Mood Selector */}
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 font-semibold mb-3">How are you feeling today?</p>
          <div className="flex flex-wrap gap-3">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                title={mood.label}
                className={`w-12 h-12 text-2xl rounded-lg border-2 transition-all hover:scale-110 hover:shadow-md ${
                  selectedMood === mood.id
                    ? 'border-purple-500 bg-purple-100 dark:bg-purple-900'
                    : 'border-transparent bg-gray-100 dark:bg-gray-700'
                }`}
              >
                {mood.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Tags Selector */}
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 font-semibold mb-3">Add tags to your entry:</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                  selectedTags.includes(tag.id)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Journal Editor */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your thoughts here... What's on your mind today?"
          className="w-full min-h-[200px] p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all resize-y mb-4"
        />

        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          Save Entry
        </button>
      </div>

      {/* Recent Entries */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Entries</h2>
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {entries.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-10 italic">
              No entries yet. Start journaling today!
            </p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-purple-500 hover:shadow-md hover:translate-x-1 transition-all animate-slide-in"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
                    {formatDate(entry.date)}
                  </span>
                  <div className="flex items-center gap-2">
                    {entry.mood && (
                      <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                    )}
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="Delete entry"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {entry.tags.map((tagId) => {
                      const tag = tags.find(t => t.id === tagId)
                      return tag ? (
                        <span
                          key={tagId}
                          className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded text-xs font-semibold"
                        >
                          {tag.label}
                        </span>
                      ) : null
                    })}
                  </div>
                )}
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{entry.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default JournalSection
