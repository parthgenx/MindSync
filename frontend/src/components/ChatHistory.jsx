import { useState } from 'react'
import { Plus, MessageSquare, Trash2, PanelLeftClose, PanelLeft } from 'lucide-react'

function ChatHistory({
    conversations,
    activeConversationId,
    onSelectConversation,
    onNewConversation,
    onDeleteConversation,
    loading
}) {
    const [collapsed, setCollapsed] = useState(false)

    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diffMs = now - date
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return `${diffDays} days ago`
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    // Group conversations by date
    const grouped = conversations.reduce((acc, conv) => {
        const label = formatDate(conv.updated_at || conv.created_at)
        if (!acc[label]) acc[label] = []
        acc[label].push(conv)
        return acc
    }, {})

    if (collapsed) {
        return (
            <div className="flex flex-col items-center gap-3 py-4 px-2">
                <button
                    onClick={() => setCollapsed(false)}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    title="Expand sidebar"
                >
                    <PanelLeft size={20} />
                </button>
                <button
                    onClick={onNewConversation}
                    className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40 transition-all"
                    title="New Chat"
                >
                    <Plus size={20} />
                </button>
            </div>
        )
    }

    return (
        <div className="chat-history-sidebar flex flex-col h-full animate-fade-in">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/10">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">History</h3>
                <button
                    onClick={() => setCollapsed(true)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    title="Collapse sidebar"
                >
                    <PanelLeftClose size={18} />
                </button>
            </div>

            {/* New Chat Button */}
            <div className="p-3">
                <button
                    onClick={onNewConversation}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 text-indigo-300 hover:from-indigo-600/30 hover:to-purple-600/30 hover:border-indigo-500/50 transition-all text-sm font-medium"
                >
                    <Plus size={18} />
                    New Chat
                </button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="text-center py-8">
                        <MessageSquare className="mx-auto mb-3 text-gray-600" size={32} />
                        <p className="text-sm text-gray-500">No conversations yet</p>
                        <p className="text-xs text-gray-600 mt-1">Start a new chat to begin</p>
                    </div>
                ) : (
                    Object.entries(grouped).map(([label, convos]) => (
                        <div key={label}>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-2">{label}</p>
                            <div className="space-y-1">
                                {convos.map((conv) => (
                                    <div
                                        key={conv.id}
                                        className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all text-sm ${activeConversationId === conv.id
                                                ? 'bg-indigo-600/20 border border-indigo-500/30 text-white'
                                                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                                            }`}
                                        onClick={() => onSelectConversation(conv.id)}
                                    >
                                        <MessageSquare size={16} className="flex-shrink-0 opacity-50" />
                                        <span className="flex-1 truncate">{conv.title}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onDeleteConversation(conv.id)
                                            }}
                                            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                            title="Delete conversation"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default ChatHistory
