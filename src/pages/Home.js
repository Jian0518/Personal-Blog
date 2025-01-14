import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase-config';
import { Link } from 'react-router-dom';
import { Container, Card, CardContent, Typography, Grid, Box } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));
      const data = await getDocs(postsQuery);
      const postsData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setPosts(postsData);
    };

    getPosts();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          textAlign: 'center', 
          mb: 4,
          color: '#1976d2',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        Latest Posts
      </Typography>
      <Grid container spacing={3}>
        {posts.map(post => (
          <Grid item xs={12} key={post.id}>
            <Card 
              sx={{ 
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.25)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <CardContent>
                <Typography 
                  variant="h5" 
                  component={Link} 
                  to={`/post/${post.id}`} 
                  sx={{ 
                    textDecoration: 'none', 
                    color: '#1976d2',
                    '&:hover': {
                      color: '#1565c0'
                    }
                  }}
                >
                  {post.title}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  mt: 1, 
                  color: 'text.secondary',
                  alignItems: 'center'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CategoryIcon fontSize="small" />
                    <Typography variant="body2">
                      {post.category}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="body2">
                      {formatDate(post.timestamp)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home; 