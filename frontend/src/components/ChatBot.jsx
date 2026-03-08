import { useRef, useEffect } from 'react'
import { Send, Bot, User, MessageSquare } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

function ChatBot({ messages, onSendMessage, loading, hasActiveConversation }) {
  const inputRef = useRef(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    const input = inputRef.current
    if (!input || !input.value.trim() || loading) return
    onSendMessage(input.value.trim())
    input.value = ''
  }

  // Empty state when no conversation is selected
  if (!hasActiveConversation) {
    return (
      <div className="glass flex-1 h-[600px] flex flex-col items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="text-indigo-400" size={36} />
          </div>
          <h2 className="text-2xl font-bold gradient-text mb-3">Start a Conversation</h2>
          <p className="text-gray-400 max-w-sm">
            Create a new chat or select an existing conversation from the sidebar to get started.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass flex-1 h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bot className="text-indigo-400" />
          AI Chat Assistant
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 animate-fade-in ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <Bot size={18} />
              </div>
            )}

            <div
              className={`max-w-[75%] p-4 rounded-2xl ${message.role === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'glass-hover'
                }`}
            >
              {message.role === 'assistant' ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                      strong: ({ node, ...props }) => <strong className="text-indigo-300 font-semibold" {...props} />,
                      em: ({ node, ...props }) => <em className="text-purple-300" {...props} />,
                      h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2 text-indigo-300" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2 text-indigo-300" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-1 text-indigo-300" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                      li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                      code: ({ node, inline, ...props }) =>
                        inline
                          ? <code className="bg-indigo-900/50 px-1.5 py-0.5 rounded text-indigo-200" {...props} />
                          : <code className="block bg-indigo-900/50 p-2 rounded my-2 text-indigo-200" {...props} />,
                      a: ({ node, ...props }) => <a className="text-indigo-400 hover:text-indigo-300 underline" {...props} />,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm leading-relaxed">{message.content}</p>
              )}
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                <User size={18} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div className="glass-hover p-4 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-xl transition-all flex items-center gap-2 glow-hover"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatBot