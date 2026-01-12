import { useState, useEffect } from 'react'

function QuoteCard() {
  const [quote, setQuote] = useState({ text: '', author: '' })
  const [isLoading, setIsLoading] = useState(true)

  const fetchQuote = async () => {
    setIsLoading(true)
    try {
      // Try fetching from ZenQuotes API
      const response = await fetch('https://zenquotes.io/api/random')
      const data = await response.json()
      if (data && data[0]) {
        setQuote({
          text: data[0].q,
          author: data[0].a
        })
      }
    } catch (error) {
      // Fallback quotes if API fails
      const fallbackQuotes = [
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
        { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
        { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
        { text: "The mind is everything. What you think you become.", author: "Buddha" },
        { text: "Peace comes from within. Do not seek it without.", author: "Buddha" }
      ]
      const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
      setQuote(randomQuote)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQuote()
  }, [])

  return (
    <div className="bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6 lg:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Floating Icon */}
      <div className="text-center text-5xl mb-4 animate-float">✨</div>

      {/* Quote Text */}
      {isLoading ? (
        <p className="text-gray-600 dark:text-gray-300 text-center text-lg leading-relaxed min-h-[80px] flex items-center justify-center">
          Loading inspiration...
        </p>
      ) : (
        <p className="text-gray-700 dark:text-gray-200 text-center text-lg leading-relaxed min-h-[80px] italic">
          "{quote.text}"
        </p>
      )}

      {/* Author */}
      {quote.author && !isLoading && (
        <p className="text-gray-500 dark:text-gray-400 text-center text-sm mt-4">
          — {quote.author}
        </p>
      )}

      {/* Refresh Button */}
      <button
        onClick={fetchQuote}
        disabled={isLoading}
        className="w-full mt-6 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-all hover:shadow-md"
      >
        🔄 New Quote
      </button>
    </div>
  )
}

export default QuoteCard
