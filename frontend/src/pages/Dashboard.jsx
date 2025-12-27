import { useState } from 'react'
import { MessageSquare, CheckSquare, Cloud, Newspaper, Sparkles } from 'lucide-react'
import ChatBot from '../components/ChatBot'
import TaskManager from '../components/TaskManager'
import WeatherWidget from '../components/WeatherWidget'
import NewsWidget from '../components/NewsWidget'
import { useAuth } from '../context/AuthContext'
import { LogOut } from 'lucide-react'

function Dashboard() {
  const [activeTab, setActiveTab] = useState('chat')
  const { user, logout } = useAuth()

  const tabs = [
    { id: 'chat', name: 'AI Assistant', icon: MessageSquare },
    { id: 'tasks', name: 'Tasks', icon: CheckSquare },
    { id: 'weather', name: 'Weather', icon: Cloud },
    { id: 'news', name: 'News', icon: Newspaper },
  ]

  return (
     <div className="min-h-screen p-4 md:p-8">
      {/* Enhanced Header */}
      <header className="mb-8 animate-fade-in">
        <div className="flex justify-between items-start">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <Sparkles className="text-indigo-400 animate-pulse" size={32} />
              <h1 className="text-5xl md:text-6xl font-bold gradient-text">
                AI Personal Assistant
              </h1>
            </div>
            <p className="text-gray-400 text-lg">
              Welcome back, {user?.email}
            </p>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={logout}
            className="glass-hover px-4 py-2 rounded-lg flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
        {/* Decorative Line */}
        <div className="mt-4 h-1 w-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>
      </header>
      {/* Enhanced Navigation Tabs */}
      <nav className="glass mb-8 p-2 inline-flex gap-2 animate-slide-in glow">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium
                ${activeTab === tab.id 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50 scale-105' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 hover:scale-105'
                }
              `}
            >
              <Icon size={20} />
              <span className="hidden md:inline">{tab.name}</span>
            </button>
          )
        })}
      </nav>
      {/* Main Content with Animation */}
      <main className="animate-scale-in">
        {activeTab === 'chat' && <ChatBot />}
        {activeTab === 'tasks' && <TaskManager />}
        {activeTab === 'weather' && <WeatherWidget />}
        {activeTab === 'news' && <NewsWidget />}
      </main>
    </div>
  )
}
export default Dashboard