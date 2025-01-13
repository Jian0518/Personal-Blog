import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase-config';
import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function CategoryView() {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostsByCategory = async () => {
      try {
        setLoading(true);
        const postsQuery = query(collection(db, "posts"), where("category", "==", category));
        const querySnapshot = await getDocs(postsQuery);
        const postsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setPosts(postsData);
      } catch (err) {
        setError('Failed to load posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsByCategory();
  }, [category]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          textAlign: 'center', 
          mb: 4,
          color: '#1976d2',
          fontWeight: 'bold'
        }}
      >
        Posts in {category} Category
      </Typography>
      <Grid container spacing={3}>
        {posts.map(post => (
          <Grid item xs={12} key={post.id}>
            <Card 
              sx={{ 
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
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
                <Box sx={{ display: 'flex', gap: 2, mt: 1, color: 'text.secondary' }}>
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

export default CategoryView; 