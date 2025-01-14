import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { TextField, Button, Container, MenuItem } from '@mui/material';
import ReactMarkdown from 'react-markdown';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const categories = ['Technology', 'Git', 'Travel', 'Behavioural Questions', 'Other'];

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
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
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
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Create Post
        </Button>
      </form>
      <h2>Preview</h2>
      <ReactMarkdown>{content}</ReactMarkdown>
    </Container>
  );
}

export default CreatePost; 