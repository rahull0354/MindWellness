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
    <div className="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 group">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 dark:from-violet-600 dark:via-purple-700 dark:to-fuchsia-600 transition-all duration-500 group-hover:scale-105"></div>

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-md"></div>

      {/* Decorative circles */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-400/30 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-400/30 rounded-full blur-2xl"></div>

      {/* Content */}
      <div className="relative p-6 lg:p-8">
        {/* Floating Icon with glow effect */}
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-300/50 rounded-full blur-xl animate-pulse"></div>
            <div className="relative text-5xl">✨</div>
          </div>
        </div>

        {/* Quote Text */}
        {isLoading ? (
          <div className="min-h-28 flex items-center justify-center">
            <p className="text-white/90 text-center text-lg leading-relaxed font-light">
              Loading inspiration...
            </p>
          </div>
        ) : (
          <div className="min-h-28 flex items-center justify-center">
            <p className="text-white text-center text-lg leading-relaxed font-light">
              "{quote.text}"
            </p>
          </div>
        )}

        {/* Author */}
        {quote.author && !isLoading && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/50"></div>
            <p className="text-white/80 text-center text-sm font-medium tracking-wide">
              {quote.author}
            </p>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/50"></div>
          </div>
        )}

        {/* Refresh Button */}
        <button
          onClick={fetchQuote}
          disabled={isLoading}
          className="w-full mt-6 bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          <span className="flex items-center justify-center gap-2">
            <span>🔄</span>
            <span>New Quote</span>
          </span>
        </button>
      </div>
    </div>
  );
}

export default QuoteCard;
