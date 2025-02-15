import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { Container, Typography, Paper, Button, Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Comments from '../components/Comments';
import { useAuth } from '../contexts/AuthContext';

function PostView() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isOwner } = useAuth();

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
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
      await deleteDoc(doc(db, "posts", id));
      navigate('/');
    }
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
        <Box sx={{ 
          overflow: 'auto', 
          backgroundColor: '#fff', 
          padding: '16px', 
          borderRadius: '4px' 
        }}>
          <ReactMarkdown
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </Box>
        {isOwner && (
          <>
            <Button variant="contained" color="primary" onClick={() => navigate(`/edit/${id}`)}>
              Edit Post
            </Button>
            <Button variant="contained" color="secondary" onClick={handleDelete} style={{ marginLeft: '1rem' }}>
              Delete Post
            </Button>
          </>
        )}
      </Paper>
      <Comments postId={id} />
    </Container>
  );
}

export default PostView; 