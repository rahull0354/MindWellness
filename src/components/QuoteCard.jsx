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
    <div className="bg-white dark:bg-violet-950/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 border border-violet-200 dark:border-purple-500/50 max-w-sm">
      {/* Quote with icon */}
      <div className="flex items-start gap-2">
        <span className="text-lg shrink-0 mt-0.5">✨</span>
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <p className="text-gray-700 dark:text-purple-100 text-sm leading-relaxed">
              Loading...
            </p>
          ) : (
            <>
              <p className="text-gray-700 dark:text-purple-100 text-sm leading-relaxed line-clamp-2">
                "{quote.text}"
              </p>
              {quote.author && (
                <p className="text-gray-500 dark:text-purple-300 text-xs mt-1">
                  — {quote.author}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Refresh button */}
      <button
        onClick={fetchQuote}
        disabled={isLoading}
        className="mt-3 w-full bg-linear-to-r from-violet-500 to-fuchsia-500 dark:from-violet-600 dark:to-fuchsia-600 hover:from-violet-600 hover:to-fuchsia-600 dark:hover:from-violet-700 dark:hover:to-fuchsia-700 disabled:opacity-50 text-white font-medium py-2 px-3 rounded-lg transition-all duration-300 text-sm hover:shadow-md active:scale-[0.98]"
      >
        <span className="flex items-center justify-center gap-2">
          <span>🔄</span>
          <span>New Quote</span>
        </span>
      </button>
    </div>
  );
}

export default QuoteCard;
