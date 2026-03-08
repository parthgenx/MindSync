import { useState, useEffect, useCallback } from 'react'
import { MessageSquare, CheckSquare, Cloud, Newspaper, Sparkles } from 'lucide-react'
import ChatBot from '../components/ChatBot'
import ChatHistory from '../components/ChatHistory'
import TaskManager from '../components/TaskManager'
import WeatherWidget from '../components/WeatherWidget'
import NewsWidget from '../components/NewsWidget'
import { useAuth } from '../context/AuthContext'
import { conversationsAPI } from '../services/api'
import { LogOut } from 'lucide-react'

function Dashboard() {
  const [activeTab, setActiveTab] = useState('chat')
  const { user, logout } = useAuth()

  // Chat history state
  const [conversations, setConversations] = useState([])
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [chatLoading, setChatLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)

  const tabs = [
    { id: 'chat', name: 'AI Assistant', icon: MessageSquare },
    { id: 'tasks', name: 'Tasks', icon: CheckSquare },
    { id: 'weather', name: 'Weather', icon: Cloud },
    { id: 'news', name: 'News', icon: Newspaper },
  ]

  // Load conversations on mount
  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      setHistoryLoading(true)
      const convos = await conversationsAPI.getAll()
      setConversations(convos)
    } catch (error) {
      console.error('Failed to load conversations:', error)
    } finally {
      setHistoryLoading(false)
    }
  }

  const loadMessages = useCallback(async (conversationId) => {
    try {
      const msgs = await conversationsAPI.getMessages(conversationId)
      setMessages(msgs.map(m => ({ role: m.role, content: m.content })))
    } catch (error) {
      console.error('Failed to load messages:', error)
      setMessages([])
    }
  }, [])

  const handleSelectConversation = useCallback(async (conversationId) => {
    setActiveConversationId(conversationId)
    await loadMessages(conversationId)
  }, [loadMessages])

  const handleNewConversation = async () => {
    try {
      const conversation = await conversationsAPI.create()
      setConversations(prev => [conversation, ...prev])
      setActiveConversationId(conversation.id)
      setMessages([])
    } catch (error) {
      console.error('Failed to create conversation:', error)
    }
  }

  const handleDeleteConversation = async (conversationId) => {
    try {
      await conversationsAPI.delete(conversationId)
      setConversations(prev => prev.filter(c => c.id !== conversationId))
      if (activeConversationId === conversationId) {
        setActiveConversationId(null)
        setMessages([])
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error)
    }
  }

  const handleSendMessage = async (content) => {
    if (!activeConversationId || chatLoading) return

    // Optimistically add user message
    setMessages(prev => [...prev, { role: 'user', content }])
    setChatLoading(true)

    try {
      const response = await conversationsAPI.sendMessage(activeConversationId, content)

      // Add AI response
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.assistant_message.content }
      ])

      // Update conversation title in sidebar if it changed (first message)
      const currentConv = conversations.find(c => c.id === activeConversationId)
      if (currentConv && currentConv.title === 'New Chat') {
        const updatedTitle = content.length > 50 ? content.substring(0, 47) + '...' : content
        setConversations(prev =>
          prev.map(c =>
            c.id === activeConversationId
              ? { ...c, title: updatedTitle, updated_at: new Date().toISOString() }
              : c
          )
        )
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Enhanced Header */}
      <header className="mb-8 animate-fade-in">
        <div className="flex justify-between items-start">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <Sparkles className="text-indigo-400 animate-pulse" size={32} />
              <h1 className="text-5xl md:text-6xl font-bold gradient-text">
                MindSync
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
        {activeTab === 'chat' && (
          <div className="flex gap-4 max-w-6xl mx-auto">
            {/* Sidebar */}
            <div className="glass chat-history-container">
              <ChatHistory
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={handleSelectConversation}
                onNewConversation={handleNewConversation}
                onDeleteConversation={handleDeleteConversation}
                loading={historyLoading}
              />
            </div>
            {/* Chat Area */}
            <ChatBot
              messages={messages}
              onSendMessage={handleSendMessage}
              loading={chatLoading}
              hasActiveConversation={!!activeConversationId}
            />
          </div>
        )}
        {activeTab === 'tasks' && <TaskManager />}
        {activeTab === 'weather' && <WeatherWidget />}
        {activeTab === 'news' && <NewsWidget />}
      </main>
    </div>
  )
}

export default Dashboard