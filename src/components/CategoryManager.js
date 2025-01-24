import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, getDocs, doc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

function CategoryManager({ open, onClose }) {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, "categories"));
    const categoriesData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setCategories(categoriesData);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      await addDoc(collection(db, "categories"), {
        name: newCategory.trim(),
        parentId: parentCategory || null
      });
      setNewCategory('');
      setParentCategory('');
      fetchCategories();
    } catch (err) {
      setError('Failed to add category');
      console.error(err);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (confirmDelete) {
      try {
        // Check if category has children
        const hasChildren = categories.some(cat => cat.parentId === categoryId);
        if (hasChildren) {
          alert("Cannot delete category with subcategories. Please delete subcategories first.");
          return;
        }
        
        await deleteDoc(doc(db, "categories", categoryId));
        fetchCategories();
      } catch (err) {
        setError('Failed to delete category');
        console.error(err);
      }
    }
  };


  // Get only parent categories (categories without parentId)
  const parentCategories = categories.filter(cat => !cat.parentId);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Categories</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleAddCategory}>
          <TextField
            fullWidth
            label="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Parent Category (Optional)</InputLabel>
            <Select
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value)}
              label="Parent Category (Optional)"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {parentCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ mt: 1 }}
          >
            Add Category
          </Button>
        </form>
        <List sx={{ mt: 2 }}>
          {/* Parent Categories */}
          {parentCategories.map((category) => (
            <Box key={category.id}>
              <ListItem>
                <ListItemText 
                  primary={category.name}
                  sx={{ fontWeight: 'bold' }}
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {/* Child Categories */}
              {categories
                .filter(child => child.parentId === category.id)
                .map(child => (
                  <ListItem key={child.id} sx={{ pl: 4 }}>
                    <ListItemText primary={child.name} />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => handleDeleteCategory(child.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
            </Box>
          ))}
          {/* Categories without parents */}
          {categories
            .filter(cat => !cat.parentId && !parentCategories.find(p => p.id === cat.id))
            .map((category) => (
              <ListItem key={category.id}>
                <ListItemText primary={category.name} />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CategoryManager; 