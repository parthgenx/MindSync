import { useState, useEffect } from 'react'
import { Newspaper, ExternalLink } from 'lucide-react'
import { newsAPI } from '../services/api'
function NewsWidget() {
  const [articles, setArticles] = useState([])
  const [category, setCategory] = useState('technology')
  const [loading, setLoading] = useState(false)
  const categories = ['technology', 'business', 'sports', 'entertainment', 'health', 'science']
  useEffect(() => {
    fetchNews()
  }, [category])
  const fetchNews = async () => {
    setLoading(true)
    try {
      const data = await newsAPI.getNews(category, 6)
      setArticles(data)
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="max-w-6xl mx-auto">
      <div className="glass p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Newspaper className="text-indigo-400" />
          Latest News
        </h2>
        {/* Category Selector */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg capitalize transition-all ${
                category === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {/* News Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading news...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass glass-hover p-4 block group"
            >
              {article.image && (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              
              <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                {article.title}
              </h3>
              
              {article.description && (
                <p className="text-sm text-gray-400 mb-3 line-clamp-3">
                  {article.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{article.source}</span>
                <ExternalLink size={14} className="group-hover:text-indigo-400 transition-colors" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
export default NewsWidget