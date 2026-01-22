function Header({ darkMode, onToggleDarkMode }) {
  return (
    <header className="bg-linear-to-r from-violet-500 via-purple-500 to-fuchsia-500 dark:from-violet-600 dark:via-purple-700 dark:to-fuchsia-600 rounded-2xl shadow-sm p-6 lg:p-8 transition-all duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl lg:text-3xl font-semibold text-white drop-shadow-sm">
          Mental Wellness Journal
        </h1>
        <button
          onClick={onToggleDarkMode}
          className="bg-white/30 hover:bg-white/40 backdrop-blur-sm px-4 py-2 rounded-xl text-2xl transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}

export default Header
