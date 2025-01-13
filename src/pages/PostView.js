import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { Container, Typography, Paper, Button } from '@mui/material';
import ReactMarkdown from 'react-markdown';

function PostView() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getPost = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ ...docSnap.data(), id: docSnap.id });
        } else {
          setError('Post not found');
        }
      } catch (err) {
        setError('Failed to load post');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getPost();
  }, [id]);

  const handleDelete = async () => {
    await deleteDoc(doc(db, "posts", id));
    navigate('/');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Paper style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          {post.title}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Category: {post.category}
        </Typography>
        <Typography style={{ whiteSpace: 'pre-wrap' }}>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate(`/edit/${id}`)}>
          Edit Post
        </Button>
        <Button variant="contained" color="secondary" onClick={handleDelete} style={{ marginLeft: '1rem' }}>
          Delete Post
        </Button>
      </Paper>
    </Container>
  );
}

export default PostView; 