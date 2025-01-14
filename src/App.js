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
        <div className="App" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
          <Navbar categories={categories} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/edit/:id" element={<EditPost />} />
            <Route path="/category/:category" element={<CategoryView />} />
            <Route path="/post/:id" element={<PostView />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 