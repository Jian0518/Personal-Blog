import { useState } from 'react';
import { 
  TextField, 
  InputAdornment, 
  IconButton, 
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useNavigate } from 'react-router-dom';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setIsDialogOpen(true);
    try {
      const postsRef = collection(db, "posts");
      const searchTermLower = searchTerm.toLowerCase();
      
      // Get all posts and filter them
      const querySnapshot = await getDocs(postsRef);
      const results = [];
      
      querySnapshot.forEach((doc) => {
        const post = doc.data();
        if (
          post.title.toLowerCase().includes(searchTermLower) ||
          post.content.toLowerCase().includes(searchTermLower)
        ) {
          results.push({
            id: doc.id,
            ...post
          });
        }
      });

      setSearchResults(results);
    } catch (error) {
      console.error("Error searching posts:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (postId) => {
    setIsDialogOpen(false);
    setSearchTerm('');
    navigate(`/post/${postId}`);
  };

  return (
    <>
      <form onSubmit={handleSearch}>
        <TextField
          size="small"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 1,
            '& .MuiInputBase-root': {
              color: 'white',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type="submit" sx={{ color: 'white' }}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>

      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Search Results
            <IconButton onClick={() => setIsDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {isSearching ? (
            <Typography>Searching...</Typography>
          ) : searchResults.length === 0 ? (
            <Typography>No results found</Typography>
          ) : (
            <List>
              {searchResults.map((result) => (
                <ListItem 
                  key={result.id} 
                  button 
                  onClick={() => handleResultClick(result.id)}
                  sx={{
                    mb: 1,
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    },
                  }}
                >
                  <ListItemText
                    primary={result.title}
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {result.content}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Search; 