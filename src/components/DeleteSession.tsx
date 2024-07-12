import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

import React from 'react';

const DeleteSession = () => {
  return (
    <>
      <Box sx={{ padding: '8px 16px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Box>This session</Box>
          <Radio style={{ color: '#1F1B13' }} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            my: 2,
          }}
        >
          <Box>This and following sessions</Box>
          <Radio style={{ color: '#1F1B13' }} />
        </Box>
      </Box>
    </>
  );
};

export default DeleteSession;
