import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase-config';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  Pagination, 
  Button, 
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [page, setPage] = useState(1);
  const postsPerPage = 6;
  const { isOwner } = useAuth();

  useEffect(() => {
    const getPosts = async () => {
      const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));
      const data = await getDocs(postsQuery);
      const postsData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      
      const filteredPosts = isOwner 
        ? postsData 
        : postsData.filter(post => post.category !== "Behavioural Questions");
      
      setPosts(filteredPosts);
    };

    const getCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Filter out private categories for non-owner users
      const filteredCategories = isOwner 
        ? categoriesData 
        : categoriesData.filter(cat => cat.name !== "Behavioural Questions");
      
      setCategories(filteredCategories);
    };

    getPosts();
    getCategories();
  }, [isOwner]);

  const formatDate = (timestamp) => {
    if (!timestamp) return { month: '', day: '', full: '' };
    const date = timestamp.toDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    const full = `${year} ${month} ${day}`;
    return { month, day, full };
  };

  // Calculate pagination
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (page - 1) * postsPerPage;
  const displayedPosts = posts.slice(startIndex, startIndex + postsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Group categories by parent
  const parentCategories = categories.filter(cat => !cat.parentId);
  const getChildCategories = (parentId) => 
    categories.filter(cat => cat.parentId === parentId);

  const handleCategoryClick = (categoryId, categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

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
        Latest Posts
      </Typography>

      {/* Content Grid - Below Title */}
      <Grid container spacing={4}>
        {/* Posts Section */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={4}>
            {displayedPosts.map(post => {
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
                      {/* Updated Title with bold effect */}
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

                      {/* Publish Date */}
                      <Typography 
                        variant="subtitle2" 
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
                      >
                        <span>Publish On</span>
                        <Box component="span" sx={{ ml: 1 }}>{date.full}</Box>
                      </Typography>

                      {/* Category */}
                      <Box sx={{ mt: 2 }}>
                        <Chip 
                          label={post.category}
                          size="small"
                          sx={{ 
                            backgroundColor: '#87CEEB',
                            color: 'white'
                          }}
                        />
                      </Box>

                      {/* Content Preview */}
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

                      {/* Read All Button */}
                      <Box sx={{ mt: 2, textAlign: 'right' }}>
                        <Button 
                          component={Link}
                          to={`/post/${post.id}`}
                          variant="contained"
                          sx={{ 
                            backgroundColor: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            '&:hover': {
                              backgroundColor: '#5F9EA0'
                            }
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
        </Grid>

        {/* Updated Categories Section with adjusted spacing */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
            <Typography variant="h6" sx={{ 
              p: 1, 
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', 
              color: 'white',
              borderRadius: '4px'
            }}>
              Category
            </Typography>
            <List sx={{ py: 0 }}>
              {parentCategories.map((category) => {
                const hasChildren = getChildCategories(category.id).length > 0;
                const isExpanded = expandedCategories[category.id];

                return (
                  <Box key={category.id} sx={{ py: 0 }}>
                    <ListItem 
                      onClick={() => hasChildren && handleCategoryClick(category.id, category.name)}
                      component={hasChildren ? 'div' : Link}
                      to={hasChildren ? undefined : `/category/${category.name}`}
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
                        primary={category.name}
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
                        {getChildCategories(category.id).map((child) => (
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
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home; 