import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import CategoryView from './pages/CategoryView';
import PostView from './pages/PostView';
import SnowEffect from './components/SnowEffect';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AuthProvider } from './contexts/AuthContext';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <div className="App" style={{ 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh',
            position: 'relative',
          }}>
            <SnowEffect />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <Navbar />
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
    </MuiThemeProvider>
  );
}

export default App; 