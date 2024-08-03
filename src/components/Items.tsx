// components/Items.tsx
import { useEffect, useState, ChangeEvent } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Box, Button, Card, CardContent, CardMedia, TextField, Typography, Modal, Grid } from '@mui/material';
import { Item } from '../types/Items';
import AddItemModal from './AddItemModal';

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, 'items'));
    setItems(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Item)));
    console.log(items);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEditItem = async (item: Item) => {
    await updateDoc(doc(db, 'items', item.id), {
      name: item.name,
      quantity: item.quantity,
    });
    fetchItems();
    setOpenEditModal(false);
  };

  const handleDeleteItem = async (itemId: string) => {
    await deleteDoc(doc(db, 'items', itemId));
    fetchItems();
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    fetchItems();
  };

  // const refetchItems = async () => {
  //   await fetchItems();
  // };

  return (
    
    <Box sx={{ mt: 2 }}>
      <TextField label="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} fullWidth margin="dense"/>

      <Button onClick={handleAddItem} variant="contained" sx={{ mb: 2, mt:2 }}>Add Item</Button>

      <Grid container spacing={2} marginTop={5}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={item.id}>
            <Card>
              {item.image && (
                <CardMedia
                  component="img"
                  sx={{ height: 140 }}
                  image={item.image}
                  alt={item.name}
                />
              )}
              <CardContent>
                <Typography component="div" variant="h6">
                  {item.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" component="div">
                  Quantity: {item.quantity}
                </Typography>
                <Button onClick={() => {
                  setSelectedItem(item);
                  setOpenEditModal(true);
                }} sx={{ mt: 1 }}>Edit</Button>

                <Button onClick={() => handleDeleteItem(item.id)} sx={{ mt: 1, ml: 1 }} color="error">
                  Delete
                </Button>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <AddItemModal open={openAddModal} handleClose={handleCloseAddModal} />
      {selectedItem && (
        <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
          <Box sx={{ ...modalStyle }}>
            <Typography variant="h6" component="h2">
              Edit Item
            </Typography>
            <TextField
              label="Name"
              value={selectedItem.name}
              onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Quantity"
              value={selectedItem.quantity}
              onChange={(e) => setSelectedItem({ ...selectedItem, quantity: e.target.value })}
              fullWidth
              margin="normal"
            />
            <Button onClick={() => handleEditItem(selectedItem)} variant="contained" sx={{ mt: 2 }}>
              Save Changes
            </Button>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default Items;
