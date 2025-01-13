import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import { Container, Card, CardContent, Typography, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

function CategoryView() {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const q = query(collection(db, "posts"), where("category", "==", category));
      const data = await getDocs(q);
      setPosts(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    getPosts();
  }, [category]);

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Posts in {category}
      </Typography>
      <Grid container spacing={3}>
        {posts.map(post => (
          <Grid item xs={12} key={post.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component={Link} to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {post.title}
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

export default CategoryView; 