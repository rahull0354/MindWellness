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
      <div className="bg-white dark:bg-violet-950/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-violet-200 dark:border-purple-500/50">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">Today's Journal Entry</h2>
        <p className="text-gray-500 dark:text-purple-200 text-sm mb-6">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>

        {/* Mood Selector */}
        <div className="mb-6">
          <p className="text-gray-500 dark:text-purple-200 font-medium mb-3">How are you feeling today?</p>
          <div className="flex flex-wrap gap-3">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                title={mood.label}
                className={`w-12 h-12 text-2xl rounded-xl border-2 transition-all duration-300 hover:scale-110 hover:shadow-sm ${
                  selectedMood === mood.id
                    ? 'border-fuchsia-500 bg-fuchsia-100 dark:bg-fuchsia-900/70 shadow-sm'
                    : 'border-transparent bg-violet-100 dark:bg-purple-900/40 hover:bg-purple-100 dark:hover:bg-purple-900/60'
                }`}
              >
                {mood.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Tags Selector */}
        <div className="mb-6">
          <p className="text-gray-700 dark:text-purple-200 font-medium mb-3">Add tags to your entry:</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                  selectedTags.includes(tag.id)
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 dark:from-violet-600 dark:to-fuchsia-600 text-white shadow-sm'
                    : 'bg-violet-100 dark:bg-purple-900/40 text-gray-600 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-900/60'
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
          className="w-full min-h-50 p-4 rounded-xl border-2 border-violet-200 dark:border-purple-500/50 bg-violet-50 dark:bg-purple-900/30 text-gray-800 dark:text-white focus:outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100 dark:focus:ring-fuchsia-900/50 transition-all duration-300 resize-y mb-4"
        />

        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 dark:from-violet-600 dark:via-purple-700 dark:to-fuchsia-600 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 dark:hover:from-violet-700 dark:hover:via-purple-800 dark:hover:to-fuchsia-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-md active:scale-[0.98]"
        >
          Save Entry
        </button>
      </div>

      {/* Recent Entries */}
      <div className="bg-white dark:bg-violet-950/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-violet-200 dark:border-purple-500/50">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Entries</h2>
        <div className="space-y-4 max-h-125 overflow-y-auto">
          {entries.length === 0 ? (
            <p className="text-gray-400 dark:text-purple-300 text-center py-10 italic">
              No entries yet. Start journaling today!
            </p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-violet-50 dark:bg-purple-900/30 p-4 rounded-xl border-l-4 border-fuchsia-400 hover:shadow-sm hover:translate-x-1 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-500 dark:text-purple-200 font-medium">
                    {entry.localDate || formatDate(entry.date)}
                  </span>
                  <div className="flex items-center gap-2">
                    {entry.mood && (
                      <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                    )}
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="text-rose-400 hover:text-rose-600 dark:text-rose-300 dark:hover:text-rose-400 transition-colors"
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
                          className="bg-fuchsia-100 dark:bg-fuchsia-900/70 text-fuchsia-700 dark:text-fuchsia-300 px-2 py-1 rounded-lg text-xs font-medium"
                        >
                          {tag.label}
                        </span>
                      ) : null
                    })}
                  </div>
                )}
                <p className="text-gray-700 dark:text-purple-100 whitespace-pre-wrap">{entry.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default JournalSection
