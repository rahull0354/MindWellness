const tabs = [
  { id: 'journal', label: '📝 Journal' },
  { id: 'mood', label: '😊 Mood Tracker' },
  { id: 'calendar', label: '📅 Calendar' },
  { id: 'trends', label: '📈 Trends' },
]

function Navigation({ activeTab, onTabChange }) {
  return (
    <nav className="bg-white dark:bg-violet-950/80 backdrop-blur-sm rounded-xl shadow-sm p-2 flex gap-2 flex-wrap border border-violet-200 dark:border-purple-500/50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 min-w-25 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
            activeTab === tab.id
              ? 'bg-linear-to-r from-violet-500 to-fuchsia-500 dark:from-violet-600 dark:to-fuchsia-600 text-white shadow-sm'
              : 'text-gray-500 dark:text-purple-200 hover:bg-violet-100 dark:hover:bg-purple-900/40'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

export default Navigation
