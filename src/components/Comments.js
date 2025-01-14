import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import { TextField, Button, Typography, List, ListItem, ListItemText, Avatar, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      const commentsQuery = query(collection(db, "comments"), where("postId", "==", postId));
      const querySnapshot = await getDocs(commentsQuery);
      const commentsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setComments(commentsData);
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (commentText.trim() === '') return;

    await addDoc(collection(db, "comments"), {
      postId,
      text: commentText,
      timestamp: new Date(),
      userEmail: user.email,
      userName: user.displayName,
      userPhoto: user.photoURL
    });

    setCommentText('');
    // Fetch comments again to update the list
    const commentsQuery = query(collection(db, "comments"), where("postId", "==", postId));
    const querySnapshot = await getDocs(commentsQuery);
    const commentsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setComments(commentsData);
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>
      {user ? (
        <form onSubmit={handleAddComment}>
          <TextField
            fullWidth
            label="Add a comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      ) : (
        <Typography color="textSecondary">
          Please login to leave a comment
        </Typography>
      )}
      <List>
        {comments.map(comment => (
          <ListItem key={comment.id}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Avatar src={comment.userPhoto} alt={comment.userName} />
              <ListItemText 
                primary={comment.text} 
                secondary={`${comment.userName} - ${new Date(comment.timestamp.seconds * 1000).toLocaleString()}`} 
              />
            </Box>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default Comments; 