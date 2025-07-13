
# 🤖 AI Product Finder

A modern, intelligent product search application that uses AI to understand natural language queries and scrape products from Amazon with advanced filtering capabilities.

## ✨ Features

### 🎯 **Intelligent Search**
- Natural language query processing
- AI-powered filter detection and application
- Real-time product scraping from Amazon
- Advanced filtering by price, rating, brand, size, and more

### 🎨 **Modern UI/UX**
- Beautiful gradient design with animated backgrounds
- Responsive layout with 3-column product grid
- Interactive product cards with hover effects
- Real-time status updates via WebSocket
- Smooth animations and transitions

### 🔧 **Technical Features**
- FastAPI backend with WebSocket support
- React frontend with TypeScript
- Selenium-based web scraping
- AI integration with Groq LLM
- Real-time communication between frontend and backend

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Chrome browser (for Selenium)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the FastAPI server:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8001 --reload
   ```

   Or run directly with Python:
   ```bash
   python main.py
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
test-project/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py          # API endpoints
│   │   ├── core/
│   │   ├── llm/
│   │   │   ├── default_llm.py     # LLM configuration
│   │   │   └── functions/
│   │   │       └── detect_filters.py  # AI filter detection
│   │   ├── models/
│   │   │   └── filters.py         # Data models
│   │   ├── scraping/
│   │   │   ├── alibaba/
│   │   │   └── amazon/
│   │   │       └── main_scripts.py    # Web scraping logic
│   │   └── services/
│   │       └── filter_service.py   # Filter processing
│   ├── main.py                    # FastAPI application
│   └── requirements.txt           # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FilterBox/
│   │   │   │   └── filterbox.tsx  # Filter display component
│   │   │   └── ProductCard/
│   │   │       └── product_card.tsx # Product display component
│   │   ├── view/
│   │   │   └── HomePage/
│   │   │       └── homepage.tsx   # Main application page
│   │   ├── api/
│   │   │   └── api.tsx           # API integration
│   │   └── main.tsx              # React entry point
│   ├── package.json              # Node.js dependencies
│   └── vite.config.ts           # Vite configuration
└── README.md                     # This file
```

## 🔧 API Endpoints

### REST API
- `POST /detect-filters` - Extract filters from natural language query
- `GET /health` - Health check endpoint

### WebSocket
- `ws://localhost:8001/ws/get-data` - Real-time product scraping

## 🎯 Usage

1. **Enter your search query** in natural language (e.g., "jeans pants under $20 with 5 star reviews")

2. **AI processes your query** and extracts relevant filters:
   - Product category
   - Price range
   - Rating requirements
   - Brand preferences
   - Size specifications
   - And more...

3. **Real-time scraping** begins with status updates:
   - Connecting to WebSocket
   - Searching products
   - Scraping filters
   - Applying filters
   - Scraping products

4. **View results** in a beautiful 3-column grid with:
   - Product images
   - Titles and prices
   - Star ratings
   - Direct links to products

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Selenium** - Web scraping and automation
- **Groq LLM** - AI-powered natural language processing
- **WebSocket** - Real-time communication
- **ChromeDriver** - Browser automation

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool
- **WebSocket** - Real-time updates

## 🎨 UI/UX Features

### Design System
- **Gradient backgrounds** with animated blobs
- **Glass morphism** effects with backdrop blur
- **Responsive grid** layout (1-3 columns)
- **Smooth animations** and transitions
- **Interactive hover effects**

### User Experience
- **Real-time status updates** during scraping
- **Loading animations** with progress indicators
- **Error handling** with user-friendly messages
- **Keyboard navigation** support
- **Mobile-responsive** design

## 🔍 Advanced Features

### AI-Powered Filtering
- Natural language query understanding
- Automatic filter detection from available options
- Smart filter application based on user preferences
- Dynamic filter type detection (checkbox, button, etc.)

### Web Scraping Capabilities
- Headless Chrome browser automation
- Anti-detection measures (user agents, delays)
- Robust error handling and retry logic
- Real-time product data extraction

### Product Display
- **3-column responsive grid** layout
- **Interactive product cards** with hover effects
- **Star rating visualization** with SVG icons
- **Price badges** and review counts
- **Direct product links** with external icons

## 🚀 Deployment

### Backend Deployment
```bash
# Using uvicorn
uvicorn main:app --host 0.0.0.0 --port 8001

# Using Docker (if Dockerfile available)
docker build -t ai-product-finder-backend .
docker run -p 8001:8001 ai-product-finder-backend
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel/Netlify
# Upload dist/ folder to your hosting provider
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### ChromeDriver Setup
The application automatically downloads and manages ChromeDriver using `webdriver-manager`.

## 🐛 Troubleshooting

### Common Issues

1. **ChromeDriver not found**
   - The application automatically downloads ChromeDriver
   - Ensure Chrome browser is installed

2. **WebSocket connection failed**
   - Check if backend is running on port 8001
   - Verify CORS settings in backend

3. **No products found**
   - Check internet connection
   - Verify search query format
   - Check browser console for errors

### Debug Mode
Enable debug logging in the backend:
```python
logging.basicConfig(level=logging.DEBUG)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **FastAPI** for the excellent web framework
- **Selenium** for web automation capabilities
- **Groq** for AI/LLM integration
- **Tailwind CSS** for the beautiful design system
- **React** for the modern frontend framework

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Open an issue on GitHub with detailed information

---

**Made with ❤️ using modern web technologies** 