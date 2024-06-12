import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Divider } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useTheme } from '@mui/material/styles';

interface ConfirmationModalProps {
  open1: boolean;
  setOpen1: React.Dispatch<React.SetStateAction<boolean>>;
  handleSave: () => void;
  onClose: () => void;
  open2: boolean;
  setOpen2: React.Dispatch<React.SetStateAction<boolean>>;
  logout: boolean;
  handleLogoutClick: () => void;
  setLogout: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open1,
  setOpen1,
  handleSave,
  onClose,
  open2,
  setOpen2,
  logout,
  handleLogoutClick,
  setLogout,
}) => {
  const theme = useTheme();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '75%',
    bgcolor: '#fff',
    boxShadow: 24,
    borderRadius: '16px',
    '@media (min-width: 600px)': {
      width: '350px',
    },
  };

  const handleClose = () => {
    if (setOpen1) {
      setOpen1(false);
    }
    if (setOpen2) {
      setOpen2(false);
    }
    if (setLogout) {
      setLogout(false);
    }
  };

  return (
    <Modal
      open={open1 || open2 || logout}
      onClose={handleClose}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      <Box sx={style}>
        <Box sx={{ p: 3 }} id="confirmation-modal-title">
          {open1 && 'Are you sure you want to update this attendance?'}
          {open2 && 'Are you sure you want to close?'}
          {logout && 'Are you sure you want to Logout?'}
        </Box>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            p: 2,
          }}
        >
          <Button
            sx={{
              border: 'none',
              color: theme.palette.secondary.main,
              fontSize: '14px',
              fontWeight: '500',
            }}
            variant="outlined"
            onClick={handleClose}
          >
            No, go back
          </Button>
          <Button
            sx={{
              width: '128px',
              height: '40px',
              fontSize: '14px',
              fontWeight: '500',
            }}
            variant="contained"
            color="primary"
            onClick={() => {
              if (open1) handleSave();
              if (open2) onClose();
              if (logout) handleLogoutClick();
              handleClose();
            }}
          >
            Yes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
