import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import { TextField, Button, Typography, List, ListItem, Avatar, Card, CardContent, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import SendIcon from '@mui/icons-material/Send';
import CommentIcon from '@mui/icons-material/Comment';

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
    <div style={{ marginTop: '2rem' }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          borderBottom: '2px solid #1976d2',
          paddingBottom: '0.5rem'
        }}
      >
        <CommentIcon color="primary" />
        Comments ({comments.length})
      </Typography>
      
      {user ? (
        <Card sx={{ p: 2, mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <form onSubmit={handleAddComment}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Avatar src={user.photoURL} alt={user.displayName} />
              <Box sx={{ flexGrow: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  endIcon={<SendIcon />}
                  sx={{ float: 'right' }}
                >
                  Post Comment
                </Button>
              </Box>
            </Box>
          </form>
        </Card>
      ) : (
        <Card sx={{ p: 2, mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography color="textSecondary" align="center">
            Please login to leave a comment
          </Typography>
        </Card>
      )}

      <List>
        {comments.map(comment => (
          <ListItem key={comment.id} sx={{ mb: 2, p: 0 }}>
            <Card 
              sx={{ 
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateX(8px)'
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Avatar src={comment.userPhoto} alt={comment.userName} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {comment.userName}
                    </Typography>
                    <Typography variant="body1" sx={{ my: 1 }}>
                      {comment.text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.timestamp.seconds * 1000).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default Comments; 