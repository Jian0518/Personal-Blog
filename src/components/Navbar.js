import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" style={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
          My Blog
        </Typography>
        <Button color="inherit" component={Link} to="/create">
          Create Post
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 