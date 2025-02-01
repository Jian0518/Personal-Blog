import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase-config';
import { Container, Typography, Grid, Card, CardContent, Box, Pagination } from '@mui/material';
import { Link } from 'react-router-dom';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function CategoryView() {
  const { category } = useParams();
  const { isOwner } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    // Redirect non-owner users trying to access private category
    if (!isOwner && category === "Behavioural Questions") {
      navigate('/');
      return;
    }

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
  }, [category, isOwner, navigate]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Calculate pagination
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (page - 1) * postsPerPage;
  const displayedPosts = posts.slice(startIndex, startIndex + postsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        Posts in {category} Category
      </Typography>
      {displayedPosts.length === 0 ? (
        <Typography variant="h6" align="center" color="text.secondary">
          No posts available in this category.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {displayedPosts.map(post => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
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
                <CardContent sx={{ 
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <Typography 
                      variant="h6" 
                      component={Link} 
                      to={`/post/${post.id}`} 
                      sx={{ 
                        textDecoration: 'none', 
                        color: '#1976d2',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 1,
                        '&:hover': {
                          color: '#1565c0'
                        }
                      }}
                    >
                      {post.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {post.content.substring(0, 150)}...
                    </Typography>
                  </div>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    mt: 'auto',
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
      )}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
}

export default CategoryView; 