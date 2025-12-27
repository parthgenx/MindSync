# MindSync - AI Productivity Assistant

An intelligent personal assistant powered by AI to boost your productivity through smart task management, real-time information feeds, and natural conversation.



## ✨ Features

- 🤖 **AI Chatbot** - Intelligent conversations with persistent history powered by Google Gemini
- ✅ **Smart Task Management** - AI-powered task suggestions and organization
- 🌤️ **Weather Updates** - Real-time weather information for your location
- 📰 **News Feed** - Stay informed with the latest news headlines
- 🔐 **Secure Authentication** - User authentication and authorization via Supabase
- 💾 **Cloud Storage** - Reliable cloud database for your data persistence

## 🛠️ Tech Stack

### Frontend
- **React** - Modern UI library with hooks
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests

### Backend
- **FastAPI** - High-performance Python web framework
- **Supabase** - Backend-as-a-service for database and authentication
- **Google Gemini AI** - Advanced AI model for natural conversations
- **OpenWeatherMap API** - Weather data integration
- **NewsAPI** - News headlines and articles

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory with your API keys:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GEMINI_API_KEY=your_gemini_api_key
WEATHER_API_KEY=your_openweathermap_key
NEWS_API_KEY=your_news_api_key
```

5. Start the backend server:
```bash
python -m uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔑 API Keys Setup

You'll need to obtain API keys from the following services:

1. **Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Get your project URL and anon/public key from project settings

2. **Google Gemini AI**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Generate an API key for Gemini

3. **OpenWeatherMap**
   - Sign up at [openweathermap.org](https://openweathermap.org/api)
   - Generate a free API key

4. **NewsAPI**
   - Register at [newsapi.org](https://newsapi.org)
   - Get your API key from the dashboard

## 📁 Project Structure

```
mindsync/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application entry point
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic and external API integrations
│   │   └── models/          # Data models
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service functions
│   │   └── App.jsx          # Main application component
│   ├── package.json         # Node dependencies
│   └── vite.config.js       # Vite configuration
└── README.md
```

## 🎯 Usage

1. **Sign Up/Login** - Create an account or log in to access your personalized dashboard
2. **Chat with AI** - Use the chatbot to ask questions, get recommendations, or have natural conversations
3. **Manage Tasks** - Add, complete, and organize your tasks with AI-powered suggestions
4. **Check Weather** - View current weather conditions for your location
5. **Read News** - Stay updated with the latest news headlines

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for powering the intelligent conversations
- Supabase for providing robust backend infrastructure
- OpenWeatherMap and NewsAPI for real-time data feeds

## 📧 Contact

For questions or feedback, please open an issue on the GitHub repository.

---

Made with ❤️ by Parth Bhat