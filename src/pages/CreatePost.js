import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import { TextField, Button, Container, MenuItem, Grid, Paper, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoriesData = querySnapshot.docs.map(doc => doc.data().name);
      setCategories(categoriesData);
    };

    fetchCategories();
  }, []);

  const createPost = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "posts"), {
      title,
      content,
      category,
      timestamp: new Date(),
    });
    navigate('/');
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Edit Section */}
        <Grid item xs={12} md={6} sx={{ mb: 2 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Create Post
            </Typography>
            <form onSubmit={createPost}>
              <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                margin="normal"
              />
              <TextField
                select
                fullWidth
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                margin="normal"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Content"
                multiline
                rows={20}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                margin="normal"
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                sx={{ mt: 2 }}
              >
                Create Post
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Preview Section */}
        <Grid item xs={12} md={6} sx={{ mb: 2 }}>
          <Paper sx={{ p: 3, height: 768.5 }}>
            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>
            <div style={{ 
              overflow: 'auto', 
              height: 'calc(100% - 40px)',
              backgroundColor: '#fff',
              borderRadius: '4px'
            }}>
              <Typography variant="h4" gutterBottom>
                {title || 'Title'}
              </Typography>
              {category && (
                <Typography color="textSecondary" gutterBottom>
                  Category: {category}
                </Typography>
              )}
              <ReactMarkdown>{content || 'Post content will appear here'}</ReactMarkdown>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CreatePost; 