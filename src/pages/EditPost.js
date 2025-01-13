import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { TextField, Button, Container } from '@mui/material';
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
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
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
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Update Post
        </Button>
      </form>
      <h2>Preview</h2>
      <ReactMarkdown>{content}</ReactMarkdown>
    </Container>
  );
}

export default EditPost;