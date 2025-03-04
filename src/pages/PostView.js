import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { Container, Typography, Paper, Button, Box, IconButton } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Comments from '../components/Comments';
import { useAuth } from '../contexts/AuthContext';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

function PostView() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isOwner } = useAuth();
  const [isRecommended, setIsRecommended] = useState(false);

  useEffect(() => {
    const getPost = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const postData = docSnap.data();
          setPost({ ...postData, id: docSnap.id });
          setIsRecommended(postData.isRecommended || false);
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

  const toggleRecommendation = async () => {
    try {
      const docRef = doc(db, "posts", id);
      await updateDoc(docRef, {
        isRecommended: !isRecommended
      });
      setIsRecommended(!isRecommended);
    } catch (err) {
      console.error('Failed to update recommendation status:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Paper style={{ padding: '2rem' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h4">
            {post.title}
          </Typography>
          {isOwner && (
            <IconButton 
              onClick={toggleRecommendation}
              sx={{ 
                color: isRecommended ? '#FFD700' : 'inherit',
                '&:hover': { color: '#FFD700' }
              }}
            >
              {isRecommended ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
          )}
        </Box>
        <Typography color="textSecondary" gutterBottom>
          Category: {post.category}
        </Typography>
        <Box sx={{ 
          overflow: 'auto', 
          backgroundColor: '#fff', 
          padding: '16px', 
          borderRadius: '4px',
          '& table': {
            borderCollapse: 'collapse',
            width: '100%',
            marginBottom: '1rem'
          },
          '& th, & td': {
            border: '1px solid #ddd',
            padding: '8px',
            textAlign: 'left'
          },
          '& th': {
            backgroundColor: '#f5f5f5'
          },
          '& tr:nth-of-type(even)': {
            backgroundColor: '#f9f9f9'
          }
        }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
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