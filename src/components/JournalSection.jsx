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
      <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-sage-100 dark:border-sage-800/30">
        <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-100 mb-4">Today's Journal Entry</h2>
        <p className="text-gray-400 dark:text-gray-200 text-sm mb-6">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>

        {/* Mood Selector */}
        <div className="mb-6">
          <p className="text-gray-500 dark:text-gray-300 font-medium mb-3">How are you feeling today?</p>
          <div className="flex flex-wrap gap-3">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                title={mood.label}
                className={`w-12 h-12 text-2xl rounded-xl border-2 transition-all duration-300 hover:scale-110 hover:shadow-sm ${
                  selectedMood === mood.id
                    ? 'border-sage-500 bg-sage-100 dark:bg-sage-900/50 shadow-sm'
                    : 'border-transparent bg-sage-50 dark:bg-gray-700/50 hover:bg-sage-100 dark:hover:bg-sage-900/30'
                }`}
              >
                {mood.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Tags Selector */}
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 font-medium mb-3">Add tags to your entry:</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                  selectedTags.includes(tag.id)
                    ? 'bg-linear-to-r from-sage-400 to-sage-500 dark:from-sage-600 dark:to-lavender-600 text-white shadow-sm'
                    : 'bg-sage-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-sage-100 dark:hover:bg-sage-900/30'
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
          className="w-full min-h-50 p-4 rounded-xl border-2 border-sage-200 dark:border-sage-700/50 bg-sage-50/50 dark:bg-gray-700/30 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200 dark:focus:ring-sage-800/50 transition-all duration-300 resize-y mb-4"
        />

        <button
          onClick={handleSave}
          className="w-full bg-linear-to-r from-sage-400 via-sage-500 to-softblue-400 dark:from-sage-600 dark:via-lavender-600 dark:to-sage-600 hover:from-sage-500 hover:via-sage-600 hover:to-softblue-500 dark:hover:from-sage-700 dark:hover:via-lavender-700 dark:hover:to-sage-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-md active:scale-[0.98]"
        >
          Save Entry
        </button>
      </div>

      {/* Recent Entries */}
      <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-sage-100 dark:border-sage-800/30">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Entries</h2>
        <div className="space-y-4 max-h-125 overflow-y-auto">
          {entries.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-10 italic">
              No entries yet. Start journaling today!
            </p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-sage-50/70 dark:bg-gray-700/40 p-4 rounded-xl border-l-4 border-sage-400 hover:shadow-sm hover:translate-x-1 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {entry.localDate || formatDate(entry.date)}
                  </span>
                  <div className="flex items-center gap-2">
                    {entry.mood && (
                      <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                    )}
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="text-rose-400 hover:text-rose-500 dark:text-rose-300 dark:hover:text-rose-400 transition-colors"
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
                          className="bg-sage-100 dark:bg-sage-800/50 text-sage-700 dark:text-sage-300 px-2 py-1 rounded-lg text-xs font-medium"
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
