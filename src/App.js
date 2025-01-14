import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import CategoryView from './pages/CategoryView';
import PostView from './pages/PostView';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const categories = ['Technology', 'Git', 'Travel', 'Behavioural Questions', 'Other'];

  return (
    <AuthProvider>
      <Router>
        <div className="App" style={{ 
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '100vh',
          position: 'relative',
        }}>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2%, transparent 0%),
              radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.2) 2%, transparent 0%)
            `,
            backgroundSize: '100px 100px',
            pointerEvents: 'none',
            zIndex: 0,
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Navbar categories={categories} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/edit/:id" element={<EditPost />} />
              <Route path="/category/:category" element={<CategoryView />} />
              <Route path="/post/:id" element={<PostView />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 