// components/Header.tsx
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header = () => (
  <AppBar position="static">
    <Toolbar>
      <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
        <Typography variant="h6">
          Pantry Management
        </Typography>
      </Box>
    </Toolbar>
  </AppBar>
);

export default Header;
