import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { TextField, Button, Container, Grid, Paper, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';

function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const postData = docSnap.data();
        setTitle(postData.title);
        setContent(postData.content);
      } else {
        console.error("No such document!");
      }
    };

    fetchPost();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "posts", id);
    await updateDoc(docRef, {
      title,
      content,
    });
    navigate(`/post/${id}`);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Edit Section */}
        <Grid item xs={12} md={6} sx={{ mb: 2 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Edit Post
            </Typography>
            <form onSubmit={handleUpdate}>
              <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                margin="normal"
              />
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
                Update Post
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Preview Section */}
        <Grid item xs={12} md={6} sx={{ mb: 2 }}>
          <Paper sx={{ p: 3, height: 688.5 }}>
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
              <ReactMarkdown>{content || 'Post content will appear here'}</ReactMarkdown>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default EditPost;