import { Box } from '@mui/material';
import React from 'react';

const ScheduleModal = () => {
  return (
    <>
      <Box sx={{ padding: '10px 16px' }}>
        <Box
          sx={{
            border: '2px solid #FDBE16',
            borderRadius: '8px',
            padding: '15px',
            mb: 2,
          }}
        >
          <Box
            sx={{
              fontSize: '16px',
              fontWeight: '400',
              color: '#1F1B13',
            }}
          >
            Planned Session
          </Box>
          <Box>For fixed subjects in the timetable</Box>
        </Box>
        <Box
          sx={{
            border: '2px solid #FDBE16',
            borderRadius: '8px',
            padding: '15px',
            mb: 2,
          }}
        >
          <Box
            sx={{
              fontSize: '16px',
              fontWeight: '400',
              color: '#1F1B13',
            }}
          >
            Planned Session
          </Box>
          <Box>For fixed subjects in the timetable</Box>
        </Box>
      </Box>
    </>
  );
};

export default ScheduleModal;
