import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import CreateIcon from '@mui/icons-material/Create';
import CategoryIcon from '@mui/icons-material/Category';

function Navbar({ categories }) {
  const [anchorEl, setAnchorEl] = useState(null);

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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            onClick={handleMenuClick}
            startIcon={<CategoryIcon />}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.05)'
              }
            }}
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
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                '& .MuiMenuItem-root': {
                  '&:hover': {
                    backgroundColor: '#e3f2fd'
                  }
                }
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
          <Button 
            color="inherit" 
            component={Link} 
            to="/create"
            startIcon={<CreateIcon />}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.05)'
              }
            }}
          >
            Create Post
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 