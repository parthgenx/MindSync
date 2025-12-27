import { useState, useEffect } from "react";
import { Plus, Trash2, Check, X, Sparkles } from "lucide-react";
import { tasksAPI } from "../services/api";
import ReactMarkdown from "react-markdown";

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
  });
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  useEffect(() => {
    fetchTasks();
  }, []);
  const fetchTasks = async () => {
    try {
      const data = await tasksAPI.getAll();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    setLoading(true);
    try {
      await tasksAPI.create(newTask);
      setNewTask({ title: "", description: "", priority: "medium" });
      fetchTasks();
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setLoading(false);
    }
  };
  const toggleTask = async (task) => {
    try {
      // Only send the fields defined in the Task model
      await tasksAPI.update(task.id, {
        title: task.title,
        description: task.description,
        completed: !task.completed,
        priority: task.priority,
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  const deleteTask = async (taskId) => {
    try {
      await tasksAPI.delete(taskId);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  const getAISuggestions = async () => {
    if (!newTask.title.trim()) return;

    setLoading(true);
    try {
      const result = await tasksAPI.getSuggestions(newTask);
      setSuggestions(result);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error getting suggestions:", error);
    } finally {
      setLoading(false);
    }
  };
  const priorityColors = {
    low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    high: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Add Task Form */}
      <div className="glass p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Check className="text-indigo-400" />
          Task Manager
        </h2>

        <form onSubmit={addTask} className="space-y-4">
          <div>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              placeholder="Task title..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <textarea
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              placeholder="Description (optional)..."
              rows="2"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value })
              }
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors text-white appearance-none cursor-pointer hover:bg-white/10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.5rem center",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
            >
              <option value="low" className="bg-gray-800 text-white">
                Low Priority
              </option>
              <option value="medium" className="bg-gray-800 text-white">
                Medium Priority
              </option>
              <option value="high" className="bg-gray-800 text-white">
                High Priority
              </option>
            </select>
            <button
              type="button"
              onClick={getAISuggestions}
              disabled={loading || !newTask.title.trim()}
              className="flex items-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg transition-colors"
            >
              <Sparkles size={18} />
              AI Suggestions
            </button>
            <button
              type="submit"
              disabled={loading || !newTask.title.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 rounded-lg transition-colors ml-auto"
            >
              <Plus size={18} />
              Add Task
            </button>
          </div>
        </form>
        {/* AI Suggestions */}
        {showSuggestions && suggestions && (
          <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-purple-400 flex items-center gap-2">
                <Sparkles size={16} />
                AI Suggestions
              </h3>
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => (
                    <p
                      className="mb-2 last:mb-0 text-sm leading-relaxed text-gray-300"
                      {...props}
                    />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong
                      className="text-purple-300 font-semibold"
                      {...props}
                    />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="text-purple-200" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="list-decimal list-inside mb-2 space-y-1 text-gray-300"
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc list-inside mb-2 space-y-1 text-gray-300"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="leading-relaxed text-sm" {...props} />
                  ),
                }}
              >
                {suggestions}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
      {/* Task List */}
      <div className="glass p-6">
        <h3 className="text-xl font-semibold mb-4">
          Your Tasks ({tasks.length})
        </h3>

        {tasks.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No tasks yet. Add one above!
          </p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="glass-hover p-4 flex items-start gap-3"
              >
                <button
                  onClick={() => toggleTask(task)}
                  className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    task.completed
                      ? "bg-indigo-600 border-indigo-600"
                      : "border-gray-500 hover:border-indigo-500"
                  }`}
                >
                  {task.completed && <Check size={14} />}
                </button>
                <div className="flex-1">
                  <h4
                    className={`font-medium ${
                      task.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-sm text-gray-400 mt-1">
                      {task.description}
                    </p>
                  )}
                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs rounded border ${
                      priorityColors[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default TaskManager;
