import { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

function TrendsSection({ moodHistory, entries, moods }) {
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'

  // Prepare mood trend data (last 7 or 30 days based on view mode)
  const moodTrendData = useMemo(() => {
    const days = [];
    const moodScores = {
      happy: 5,
      grateful: 5,
      excited: 5,
      calm: 4,
      neutral: 3,
      sad: 2,
      anxious: 1,
      stressed: 1,
    };

    const today = new Date();
    const daysToShow = viewMode === 'week' ? 6 : 29; // 7 days (0-6) or 30 days (0-29)

    for (let i = daysToShow; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Compare local dates by formatting both to local date strings
      const dateStr = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      const dayMood = moodHistory.find((m) => {
        const moodDate = new Date(m.date);
        return (
          moodDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }) === dateStr
        );
      });

      days.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        score: dayMood ? moodScores[dayMood.mood] || 3 : null,
      });
    }

    return days;
  }, [moodHistory, viewMode]);

  // Prepare mood distribution data
  const moodDistributionData = useMemo(() => {
    const distribution = {};
    moods.forEach((m) => (distribution[m.id] = 0));

    moodHistory.forEach((m) => {
      if (distribution[m.mood] !== undefined) {
        distribution[m.mood]++;
      }
    });

    return {
      labels: moods.map((m) => `${m.emoji} ${m.label}`),
      data: moods.map((m) => distribution[m.id] || 0),
    };
  }, [moodHistory, moods]);

  // Calculate insights
  const insights = useMemo(() => {
    if (moodHistory.length === 0) {
      return [];
    }

    const moodScores = {
      happy: 5,
      grateful: 5,
      excited: 5,
      calm: 4,
      neutral: 3,
      sad: 2,
      anxious: 1,
      stressed: 1,
    };

    const recentMoods = moodHistory.slice(0, 7);
    const avgScore =
      recentMoods.reduce((sum, m) => sum + (moodScores[m.mood] || 3), 0) /
      recentMoods.length;

    const mostCommonMood = moods.reduce(
      (max, mood) => {
        const count = moodHistory.filter((m) => m.mood === mood.id).length;
        return count > max.count ? { mood, count } : max;
      },
      { mood: null, count: 0 },
    );

    const insightList = [];

    if (avgScore >= 4) {
      insightList.push({
        icon: "🌟",
        text: "You've had a great week! Keep up the positive mindset!",
      });
    } else if (avgScore <= 2) {
      insightList.push({
        icon: "💙",
        text: "This week has been challenging. Remember to be kind to yourself.",
      });
    } else {
      insightList.push({
        icon: "⚖️",
        text: "Your mood has been balanced this week.",
      });
    }

    if (mostCommonMood.mood) {
      insightList.push({
        icon: "📊",
        text: `Your most common mood is ${mostCommonMood.mood.emoji} ${mostCommonMood.mood.label}`,
      });
    }

    if (entries.length >= 3) {
      insightList.push({
        icon: "📝",
        text: `You've written ${entries.length} journal entries. Great job reflecting!`,
      });
    }

    return insightList;
  }, [moodHistory, entries, moods]);

  const trendChartData = {
    labels: moodTrendData.map((d) => d.date),
    datasets: [
      {
        label: "Mood Score",
        data: moodTrendData.map((d) => d.score),
        borderColor: "rgb(192, 132, 252)",
        backgroundColor: "rgba(192, 132, 252, 0.15)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const score = context.raw;
            const labels = ["", "Low", "Sad", "Neutral", "Good", "Great"];
            return `Mood: ${labels[score] || "N/A"}`;
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 6,
        ticks: {
          callback: (value) =>
            ["", "Low", "Sad", "Neutral", "Good", "Great"][value] || "",
        },
      },
    },
  };

  const distributionChartData = {
    labels: moodDistributionData.labels,
    datasets: [
      {
        data: moodDistributionData.data,
        backgroundColor: [
          "rgba(167, 139, 250, 0.8)",
          "rgba(192, 132, 252, 0.8)",
          "rgba(217, 70, 239, 0.8)",
          "rgba(232, 121, 249, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(217, 70, 239, 0.8)",
          "rgba(192, 132, 252, 0.8)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const distributionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 15,
          usePointStyle: true,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Mood Trends Chart */}
      <div className="bg-white dark:bg-violet-950/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-violet-200 dark:border-purple-500/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-white">
            Mood Trends
          </h2>
          {/* View Toggle Buttons */}
          <div className="flex gap-2 bg-violet-100 dark:bg-purple-900/40 rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-white/20 text-gray-800 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-purple-200 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              Week (7 days)
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'month'
                  ? 'bg-white dark:bg-white/20 text-gray-800 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-purple-200 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              Month (30 days)
            </button>
          </div>
        </div>
        <div className="h-75">
          {moodHistory.length > 0 ? (
            <Line data={trendChartData} options={trendChartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 dark:text-purple-300">
              <p className="text-center">Log some moods to see your trends!</p>
            </div>
          )}
        </div>
      </div>

      {/* Mood Distribution */}
      <div className="bg-white dark:bg-violet-950/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-violet-200 dark:border-purple-500/50">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
          Mood Distribution
        </h2>
        <div className="h-75">
          {moodHistory.length > 0 ? (
            <Doughnut
              data={distributionChartData}
              options={distributionChartOptions}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 dark:text-purple-300">
              <p className="text-center">Log some moods to see distribution!</p>
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white dark:bg-violet-950/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-violet-200 dark:border-purple-500/50">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
          Insights
        </h2>
        <div className="space-y-3">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <div
                key={index}
                className="bg-fuchsia-100 dark:bg-purple-900/40 p-4 rounded-xl border-l-4 border-fuchsia-400"
              >
                <span className="text-2xl mr-2">{insight.icon}</span>
                <span className="text-gray-700 dark:text-purple-100">
                  {insight.text}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-400 dark:text-purple-300 text-center py-4">
              Your mood insights will appear here as you log more entries.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrendsSection;
