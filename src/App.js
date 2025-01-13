import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import CategoryView from './pages/CategoryView';
import PostView from './pages/PostView';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/category/:category" element={<CategoryView />} />
          <Route path="/post/:id" element={<PostView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 