import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Box, 
  Pagination,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button 
} from '@mui/material';
import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function CategoryView() {
  const { category } = useParams();
  const { isOwner } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const postsPerPage = 6;
  const [recommendedPosts, setRecommendedPosts] = useState([]);

  useEffect(() => {
    if (!isOwner && category === "Behavioural Questions") {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch posts for this category
        const postsQuery = query(
          collection(db, "posts"), 
          where("category", "==", category),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(postsQuery);
        const postsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setPosts(postsData);

        // Fetch categories for the sidebar
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        const filteredCategories = isOwner 
          ? categoriesData 
          : categoriesData.filter(cat => cat.name !== "Behavioural Questions");
        
        setCategories(filteredCategories);

        // Add fetch recommended posts
        const recommendedQuery = query(
          collection(db, "posts"), 
          where("isRecommended", "==", true),
          orderBy("timestamp", "desc")
        );
        const recommendedSnapshot = await getDocs(recommendedQuery);
        const recommendedData = recommendedSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRecommendedPosts(recommendedData);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, isOwner, navigate]);

  const formatDate = (timestamp) => {
    if (!timestamp) return { month: '', day: '', full: '' };
    const date = timestamp.toDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    const full = `${year} ${month} ${day}`;
    return { month, day, full };
  };

  const parentCategories = categories.filter(cat => !cat.parentId);
  const getChildCategories = (parentId) => 
    categories.filter(cat => cat.parentId === parentId);

  const handleCategoryClick = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Title Section - Full Width */}
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
        Posts in {category}
      </Typography>

      {/* Content Grid - Below Title */}
      <Grid container spacing={4}>
        {/* Posts Section */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={4}>
            {posts.slice((page - 1) * postsPerPage, page * postsPerPage).map(post => {
              const date = formatDate(post.timestamp);
              return (
                <Grid item xs={12} key={post.id}>
                  <Card sx={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'visible' }}>
                    {/* Month/Day Circle */}
                    <Box sx={{
                      position: 'absolute',
                      left: -30,
                      top: -20,
                      width: 90,
                      height: 90,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontSize: '1.2rem',
                          mb: 0.5 
                        }}
                      >
                        {date.month}
                      </Typography>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 'bold',
                          lineHeight: 1 
                        }}
                      >
                        {date.day}
                      </Typography>
                    </Box>

                    <CardContent sx={{ pl: 9 }}>
                      <Typography 
                        variant="h5" 
                        component={Link} 
                        to={`/post/${post.id}`}
                        sx={{ 
                          textDecoration: 'none', 
                          color: 'inherit',
                          fontWeight: 600,
                          '&:hover': { 
                            color: '#1976d2',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        {post.title}
                      </Typography>

                      <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <span>Publish On</span>
                        <Box component="span" sx={{ ml: 1 }}>{date.full}</Box>
                      </Typography>

                      <Box sx={{ mt: 2 }}>
                        <Chip label={post.category} size="small" sx={{ backgroundColor: '#87CEEB', color: 'white' }} />
                      </Box>

                      <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{ 
                          mt: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {post.content}
                      </Typography>

                      <Box sx={{ mt: 2, textAlign: 'right' }}>
                        <Button 
                          component={Link}
                          to={`/post/${post.id}`}
                          variant="contained"
                          sx={{ 
                            backgroundColor: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            '&:hover': { backgroundColor: '#5F9EA0' }
                          }}
                        >
                          Read All
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {Math.ceil(posts.length / postsPerPage) > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={Math.ceil(posts.length / postsPerPage)} 
                page={page} 
                onChange={(e, value) => setPage(value)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </Grid>

        {/* Categories Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
            <Typography variant="h6" sx={{ 
              p: 1, 
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white',
              borderRadius: '4px'
            }}>
              Category
            </Typography>
            <List sx={{ py: 0 }}>
              {parentCategories.map((cat) => {
                const hasChildren = getChildCategories(cat.id).length > 0;
                const isExpanded = expandedCategories[cat.id];

                return (
                  <Box key={cat.id} sx={{ py: 0 }}>
                    <ListItem 
                      onClick={() => hasChildren && handleCategoryClick(cat.id)}
                      component={hasChildren ? 'div' : Link}
                      to={hasChildren ? undefined : `/category/${cat.name}`}
                      sx={{ 
                        color: 'inherit', 
                        textDecoration: 'none', 
                        fontWeight: 'bold',
                        transition: 'all 0.2s ease',
                        cursor: hasChildren ? 'pointer' : 'default',
                        '&:hover': {
                          backgroundColor: 'rgba(135, 206, 235, 0.1)',
                          paddingLeft: '24px',
                          color: '#1976d2'
                        },
                        display: 'flex',
                        alignItems: 'center',
                        py: 0.5,
                        minHeight: '36px'
                      }}
                    >
                      {hasChildren && (
                        <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                          {isExpanded ? (
                            <KeyboardArrowDownIcon fontSize="small" />
                          ) : (
                            <KeyboardArrowRightIcon fontSize="small" />
                          )}
                        </Box>
                      )}
                      <ListItemText 
                        primary={cat.name}
                        sx={{ 
                          my: 0,
                          '& .MuiTypography-root': {
                            fontSize: '0.95rem',
                            fontWeight: 600
                          }
                        }} 
                      />
                    </ListItem>
                    {hasChildren && isExpanded && (
                      <Box sx={{ my: 0 }}>
                        {getChildCategories(cat.id).map((child) => (
                          <ListItem 
                            key={child.id} 
                            component={Link} 
                            to={`/category/${child.name}`}
                            sx={{ 
                              pl: 4, 
                              color: 'inherit', 
                              textDecoration: 'none',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                backgroundColor: 'rgba(135, 206, 235, 0.1)',
                                paddingLeft: '40px',
                                color: '#1976d2'
                              },
                              py: 0.5,
                              minHeight: '32px'
                            }}
                          >
                            <ListItemText 
                              primary={child.name}
                              sx={{ 
                                my: 0,
                                '& .MuiTypography-root': {
                                  fontSize: '0.9rem',
                                  fontWeight: 500
                                }
                              }} 
                            />
                          </ListItem>
                        ))}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </List>
          </Paper>

          {/* Recommendations Section */}
          <Paper sx={{ p: 2, mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
            <Typography variant="h6" sx={{ 
              p: 1, 
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white',
              borderRadius: '4px',
              mb: 2
            }}>
              Recommended Posts
            </Typography>
            <List sx={{ py: 0 }}>
              {recommendedPosts.map((post) => (
                <ListItem 
                  key={post.id}
                  component={Link}
                  to={`/post/${post.id}`}
                  sx={{
                    py: 1,
                    px: 2,
                    color: 'inherit',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(135, 206, 235, 0.1)',
                      paddingLeft: '24px',
                      color: '#1976d2'
                    }
                  }}
                >
                  <Typography 
                    variant="body1"
                    sx={{
                      textDecoration: 'none',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {post.title}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CategoryView; 