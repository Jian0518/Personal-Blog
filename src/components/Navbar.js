import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import CreateIcon from '@mui/icons-material/Create';
import CategoryIcon from '@mui/icons-material/Category';
import { useAuth } from '../contexts/AuthContext';

function Navbar({ categories }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, login, logout, isOwner } = useAuth();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ 
      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
    }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              color: '#e3f2fd'
            }
          }}
        >
          DevBlog
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            color="inherit" 
            onClick={handleMenuClick}
            startIcon={<CategoryIcon />}
          >
            Categories
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
              }
            }}
          >
            {categories.map((category) => (
              <MenuItem 
                key={category} 
                component={Link} 
                to={`/category/${category}`} 
                onClick={handleMenuClose}
              >
                {category}
              </MenuItem>
            ))}
          </Menu>
          {isOwner && (
            <Button 
              color="inherit" 
              component={Link} 
              to="/create"
              startIcon={<CreateIcon />}
            >
              Create Post
            </Button>
          )}
          {user ? (
            <>
              <Avatar src={user.photoURL} alt={user.displayName} />
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={login}>
              Login with Google
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 