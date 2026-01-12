const tabs = [
  { id: 'journal', label: '📝 Journal' },
  { id: 'mood', label: '😊 Mood Tracker' },
  { id: 'calendar', label: '📅 Calendar' },
  { id: 'trends', label: '📈 Trends' },
]

function Navigation({ activeTab, onTabChange }) {
  return (
    <nav className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-2 flex gap-2 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 min-w-[100px] px-4 py-3 rounded-lg font-semibold transition-all ${
            activeTab === tab.id
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

export default Navigation
