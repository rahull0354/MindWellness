import { useMemo } from 'react'
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
  Filler
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

function TrendsSection({ moodHistory, entries, moods }) {
  // Prepare mood trend data (last 30 days)
  const moodTrendData = useMemo(() => {
    const days = []
    const moodScores = {
      happy: 5, grateful: 5, excited: 5,
      calm: 4, neutral: 3,
      sad: 2, anxious: 1, stressed: 1
    }

    const today = new Date()
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      const dayMood = moodHistory.find(m => m.date.startsWith(dateStr))
      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: dayMood ? moodScores[dayMood.mood] || 3 : null
      })
    }

    return days
  }, [moodHistory])

  // Prepare mood distribution data
  const moodDistributionData = useMemo(() => {
    const distribution = {}
    moods.forEach(m => distribution[m.id] = 0)

    moodHistory.forEach(m => {
      if (distribution[m.mood] !== undefined) {
        distribution[m.mood]++
      }
    })

    return {
      labels: moods.map(m => `${m.emoji} ${m.label}`),
      data: moods.map(m => distribution[m.id] || 0)
    }
  }, [moodHistory, moods])

  // Calculate insights
  const insights = useMemo(() => {
    if (moodHistory.length === 0) {
      return []
    }

    const moodScores = {
      happy: 5, grateful: 5, excited: 5,
      calm: 4, neutral: 3,
      sad: 2, anxious: 1, stressed: 1
    }

    const recentMoods = moodHistory.slice(0, 7)
    const avgScore = recentMoods.reduce((sum, m) => sum + (moodScores[m.mood] || 3), 0) / recentMoods.length

    const mostCommonMood = moods.reduce((max, mood) => {
      const count = moodHistory.filter(m => m.mood === mood.id).length
      return count > max.count ? { mood, count } : max
    }, { mood: null, count: 0 })

    const insightList = []

    if (avgScore >= 4) {
      insightList.push({ icon: '🌟', text: "You've had a great week! Keep up the positive mindset!" })
    } else if (avgScore <= 2) {
      insightList.push({ icon: '💙', text: "This week has been challenging. Remember to be kind to yourself." })
    } else {
      insightList.push({ icon: '⚖️', text: "Your mood has been balanced this week." })
    }

    if (mostCommonMood.mood) {
      insightList.push({
        icon: '📊',
        text: `Your most common mood is ${mostCommonMood.mood.emoji} ${mostCommonMood.mood.label}`
      })
    }

    if (entries.length >= 3) {
      insightList.push({
        icon: '📝',
        text: `You've written ${entries.length} journal entries. Great job reflecting!`
      })
    }

    return insightList
  }, [moodHistory, entries, moods])

  const trendChartData = {
    labels: moodTrendData.map(d => d.date),
    datasets: [
      {
        label: 'Mood Score',
        data: moodTrendData.map(d => d.score),
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const score = context.raw
            const labels = ['', 'Low', 'Sad', 'Neutral', 'Good', 'Great']
            return `Mood: ${labels[score] || 'N/A'}`
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 6,
        ticks: {
          callback: (value) => ['', 'Low', 'Sad', 'Neutral', 'Good', 'Great'][value] || ''
        }
      }
    }
  }

  const distributionChartData = {
    labels: moodDistributionData.labels,
    datasets: [
      {
        data: moodDistributionData.data,
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(20, 184, 166, 0.8)',
        ],
        borderWidth: 0
      }
    ]
  }

  const distributionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          usePointStyle: true
        }
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Mood Trends Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Mood Trends (Last 30 Days)</h2>
        <div className="h-[300px]">
          {moodHistory.length > 0 ? (
            <Line data={trendChartData} options={trendChartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p className="text-center">Log some moods to see your trends!</p>
            </div>
          )}
        </div>
      </div>

      {/* Mood Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Mood Distribution</h2>
        <div className="h-[300px]">
          {moodHistory.length > 0 ? (
            <Doughnut data={distributionChartData} options={distributionChartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p className="text-center">Log some moods to see distribution!</p>
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Insights</h2>
        <div className="space-y-3">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-purple-500"
              >
                <span className="text-2xl mr-2">{insight.icon}</span>
                <span className="text-gray-700 dark:text-gray-300">{insight.text}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Your mood insights will appear here as you log more entries.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TrendsSection
