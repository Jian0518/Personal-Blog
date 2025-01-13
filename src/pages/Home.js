import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase-config';
import { Link } from 'react-router-dom';
import { Container, Card, CardContent, Typography, Chip, Grid } from '@mui/material';

function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(new Set());

  useEffect(() => {
    const getPosts = async () => {
      const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));
      const data = await getDocs(postsQuery);
      const postsData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setPosts(postsData);
      
      // Extract unique categories
      const cats = new Set(postsData.map(post => post.category));
      setCategories(cats);
    };

    getPosts();
  }, []);

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Typography variant="h6" gutterBottom>
          Categories:
        </Typography>
        {Array.from(categories).map(category => (
          <Chip
            key={category}
            label={category}
            component={Link}
            to={`/category/${category}`}
            clickable
            style={{ margin: '0.5rem' }}
          />
        ))}
      </div>

      <Grid container spacing={3}>
        {posts.map(post => (
          <Grid item xs={12} key={post.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component={Link} to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {post.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Category: {post.category}
                </Typography>
                <Typography>
                  {post.content.substring(0, 200)}...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home; 