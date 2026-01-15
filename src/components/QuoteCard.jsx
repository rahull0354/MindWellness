import { useState, useEffect } from "react";

function QuoteCard() {
  const [quote, setQuote] = useState({ text: "", author: "" });
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuote = async () => {
    setIsLoading(true);
    try {
      // Try fetching from ZenQuotes API
      const response = await fetch("https://dummyjson.com/quotes");
      const data = await response.json();

      if (data) {
        const randomIndex = Math.floor(Math.random() * data.quotes.length);
        
        const randomQuote = data.quotes[randomIndex];

        setQuote({
          text: randomQuote.quote,
          author: randomQuote.author,
        });
      }
    } catch (error) {

      // Fallback quotes if API fails
      const fallbackQuotes = [
        {
          text: "The only way to do great work is to love what you do.",
          author: "Steve Jobs",
        },
        {
          text: "In the middle of difficulty lies opportunity.",
          author: "Albert Einstein",
        },
        {
          text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
          author: "Ralph Waldo Emerson",
        },
        {
          text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
          author: "Nelson Mandela",
        },
        {
          text: "Believe you can and you're halfway there.",
          author: "Theodore Roosevelt",
        },
        {
          text: "Happiness is not something ready made. It comes from your own actions.",
          author: "Dalai Lama",
        },
        {
          text: "The mind is everything. What you think you become.",
          author: "Buddha",
        },
        {
          text: "Peace comes from within. Do not seek it without.",
          author: "Buddha",
        },
      ];
      const randomQuote =
        fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(randomQuote);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="bg-linear-to-br from-white to-sage-50/50 dark:from-gray-800/50 dark:to-lavender-950/30 backdrop-blur-sm rounded-2xl shadow-sm p-6 lg:p-8 hover:shadow-md transition-all duration-500 border border-sage-100 dark:border-sage-800/30">
      {/* Floating Icon */}
      <div className="text-center text-4xl mb-4 opacity-80">✨</div>

      {/* Quote Text */}
      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-300 text-center text-lg leading-relaxed min-h-20 flex items-center justify-center">
          Loading inspiration...
        </p>
      ) : (
        <p className="text-gray-600 dark:text-gray-200 text-center text-lg leading-relaxed min-h-20 italic">
          "{quote.text}"
        </p>
      )}

      {/* Author */}
      {quote.author && !isLoading && (
        <p className="text-gray-400 dark:text-gray-400 text-center text-sm mt-4">
          — {quote.author}
        </p>
      )}

      {/* Refresh Button */}
      <button
        onClick={fetchQuote}
        disabled={isLoading}
        className="w-full mt-6 bg-linear-to-r from-sage-400 via-sage-500 to-softblue-400 dark:from-sage-600 dark:via-lavender-600 dark:to-sage-600 hover:from-sage-500 hover:via-sage-600 hover:to-softblue-500 dark:hover:from-sage-700 dark:hover:via-lavender-700 dark:hover:to-sage-700 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-sm active:scale-[0.98]"
      >
        🔄 New Quote
      </button>
    </div>
  );
}

export default QuoteCard;
