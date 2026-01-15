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

      // Compare local dates by formatting both to local date strings
      const dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })

      const dayMood = moodHistory.find(m => {
        const moodDate = new Date(m.date)
        return moodDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }) === dateStr
      })

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
        borderColor: 'rgb(116, 158, 129)',
        backgroundColor: 'rgba(116, 158, 129, 0.15)',
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
          'rgba(116, 158, 129, 0.8)',
          'rgba(135, 130, 203, 0.8)',
          'rgba(143, 201, 187, 0.8)',
          'rgba(165, 185, 196, 0.8)',
          'rgba(224, 195, 164, 0.8)',
          'rgba(217, 170, 177, 0.8)',
          'rgba(157, 130, 203, 0.8)',
          'rgba(135, 189, 186, 0.8)',
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
      <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-sage-100 dark:border-sage-800/30">
        <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-100 mb-4">Mood Trends (Last 30 Days)</h2>
        <div className="h-[300px]">
          {moodHistory.length > 0 ? (
            <Line data={trendChartData} options={trendChartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-400">
              <p className="text-center">Log some moods to see your trends!</p>
            </div>
          )}
        </div>
      </div>

      {/* Mood Distribution */}
      <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-sage-100 dark:border-sage-800/30">
        <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-100 mb-4">Mood Distribution</h2>
        <div className="h-[300px]">
          {moodHistory.length > 0 ? (
            <Doughnut data={distributionChartData} options={distributionChartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-400">
              <p className="text-center">Log some moods to see distribution!</p>
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-sage-100 dark:border-sage-800/30">
        <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-100 mb-4">Insights</h2>
        <div className="space-y-3">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <div
                key={index}
                className="bg-sage-50/70 dark:bg-gray-700/40 p-4 rounded-xl border-l-4 border-sage-400"
              >
                <span className="text-2xl mr-2">{insight.icon}</span>
                <span className="text-gray-600 dark:text-gray-300">{insight.text}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400 dark:text-gray-400 text-center py-4">
              Your mood insights will appear here as you log more entries.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TrendsSection
