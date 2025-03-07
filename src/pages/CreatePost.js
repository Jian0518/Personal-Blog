import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import { TextField, Button, Container, MenuItem, Grid, Paper, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { track } from '@vercel/analytics';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoriesData = querySnapshot.docs.map(doc => doc.data().name);
      // Sort categories alphabetically
      const sortedCategories = categoriesData.sort((a, b) => a.localeCompare(b));
      setCategories(sortedCategories);
    };

    fetchCategories();
  }, []);

  const createPost = async (e) => {
    e.preventDefault();
    const docRef = await addDoc(collection(db, "posts"), {
      title,
      content,
      category,
      timestamp: new Date(),
    });
    
    // Track post creation
    track('post_created', { 
      category,
      postId: docRef.id
    });
    
    navigate('/');
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Edit Section */}
        <Grid item xs={12} md={6} sx={{ mb: 2 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Create Post
            </Typography>
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
                Create Post
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Preview Section */}
        <Grid item xs={12} md={6} sx={{ mb: 2 }}>
          <Paper sx={{ p: 3, height: 768.5 }}>
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
              {category && (
                <Typography color="textSecondary" gutterBottom>
                  Category: {category}
                </Typography>
              )}
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
                {content || 'Post content will appear here'}
              </ReactMarkdown>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CreatePost; 