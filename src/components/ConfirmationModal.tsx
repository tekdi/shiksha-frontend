import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Divider } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

interface ConfirmationModalProps {
  updateAttendance: boolean;
  setUpdateAttendance: React.Dispatch<React.SetStateAction<boolean>>;
  confirmation: boolean;
  setConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  logout: boolean;
  handleLogoutClick: () => void;
  setLogout: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  handleAction: () => void;
  PrimaryButtonName: string;
  seconderyButtonName: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  updateAttendance,
  setUpdateAttendance,
  confirmation,
  setConfirmation,
  logout,
  setLogout,
  message,
  handleAction,
  PrimaryButtonName,
  seconderyButtonName,
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
  const { t } = useTranslation();

  const handleClose = () => {
    if (setUpdateAttendance) {
      setUpdateAttendance(false);
    }
    if (setConfirmation) {
      setConfirmation(false);
    }
    if (setLogout) {
      setLogout(false);
    }
  };

  return (
    <Modal
      open={updateAttendance || confirmation || logout}
      onClose={handleClose}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      <Box sx={style}>
        <Box sx={{ p: 3 }} id="confirmation-modal-title">
          {message}
        </Box>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '18px',
            p: 2,
          }}
        >
          <Button
            sx={{
              border: 'none',
              color: theme.palette.secondary.main,
              fontSize: '14px',
              fontWeight: '500',
              '&:hover': {
                border: 'none',
                backgroundColor: 'transparent',
              },
            }}
            variant="outlined"
            onClick={handleClose}
          >
            {seconderyButtonName}
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
              handleAction();
              handleClose();
            }}
          >
            {PrimaryButtonName}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
