// components/AddItemModal.tsx
import { useState, useRef } from 'react';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { db } from '../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { Item } from '../types/Items';
import {Camera} from 'react-camera-pro';

interface AddItemModalProps {
  open: boolean;
  handleClose: () => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ open, handleClose }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [capturing, setCapturing] = useState<boolean>(false);
  const cameraRef = useRef<any>(null);

  const handleTakePhoto = () => {
    if (cameraRef.current) {
      const photo = cameraRef.current.takePhoto();
      setImage(photo);
      setCapturing(false);
    }
  };

  const handleRetakePhoto = () => {
    setImage(null);
    setCapturing(true);
  };

  const handleAddItem = async () => {
    try {
      const newItem: Omit<Item, 'id'> = {
        name,
        quantity,
        image: image || null,
      };
      await addDoc(collection(db, 'items'), newItem);
      handleClose();
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...modalStyle }}>
        <Typography variant="h6" component="h2">
          Add Item
        </Typography>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" />
        <TextField label="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} fullWidth margin="normal" />
        
        {capturing ? (
          <>
            <Camera 
              ref={cameraRef} 
              facingMode="environment"
              errorMessages={{
                noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
                permissionDenied: 'Permission denied. Please refresh and give camera permission.',
                switchCamera: 'It is not possible to switch camera to different one because there is only one video device accessible.',
                canvas: 'Canvas is not supported.',
              }}
            />
            <Button variant="contained" onClick={handleTakePhoto} sx={{ mt: 2 }}>
              Capture Image
            </Button>
          </>
        ) : (
          <>
            {image && (
              <Box sx={{ mb: 2 }}>
                <Typography>Preview:</Typography>
                <img src={image} alt="Captured" style={{ width: '100%' }} />
              </Box>
            )}
            <Button onClick={handleRetakePhoto} variant="contained" sx={{ mt: 2 }}>
              Take Image
            </Button>
            <Button onClick={handleAddItem} variant="contained" sx={{ mt: 2 , ml:2}}>
              Add Item
            </Button>
          </>
        )}
      </Box>
    </Modal>
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

export default AddItemModal;
