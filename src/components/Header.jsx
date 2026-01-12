function Header({ darkMode, onToggleDarkMode }) {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-6 lg:p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl lg:text-3xl font-bold text-white drop-shadow-md">
          🧘 Mental Wellness Journal
        </h1>
        <button
          onClick={onToggleDarkMode}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-2xl transition-all hover:scale-105"
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}

export default Header
