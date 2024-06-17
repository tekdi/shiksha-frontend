import BottomDrawer from './BottomDrawer';
import { Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React from 'react';
import Woman2Icon from '@mui/icons-material/Woman2';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const CenterList = () => {
  const [state, setState] = React.useState({
    bottom: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  return (
    <>
      <Box px={'18px'} mt={2} sx={{ borderBottom: '1px solid #D0C5B4' }}>
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '15px',
          }}
        >
          <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Box className="box_shadow_center">
              <Woman2Icon sx={{ fontSize: '24px', color: '#1F1B13' }} />
            </Box>
            <Box>
              <Box sx={{ fontSize: '16px', color: '#1F1B13' }}>Aanya Gupta</Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{ fontSize: '12px', color: '#7C766F' }}>19 y/o</Box>
                <FiberManualRecordIcon
                  sx={{ fontSize: '9px', color: '#CDC5BD' }}
                />
                <Box sx={{ fontSize: '12px', color: '#7C766F' }}>
                  1102929282
                </Box>
              </Box>
            </Box>
          </Box>
          <MoreVertIcon
            onClick={toggleDrawer('bottom', true)}
            sx={{ fontSize: '24px', color: '#1F1B13' }}
          />
        </Box>
      </Box>

      <Box px={'18px'} mt={2} sx={{ borderBottom: '1px solid #D0C5B4' }}>
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '15px',
          }}
        >
          <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Box className="box_shadow_center">
              <Woman2Icon sx={{ fontSize: '24px', color: '#1F1B13' }} />
            </Box>
            <Box>
              <Box sx={{ fontSize: '16px', color: '#1F1B13' }}>Aanya Gupta</Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{ fontSize: '12px', color: '#7C766F' }}>19 y/o</Box>
                <FiberManualRecordIcon
                  sx={{ fontSize: '9px', color: '#CDC5BD' }}
                />
                <Box
                  sx={{
                    fontSize: '12px',
                    color: '#1F1B13',
                    background: '#FFDAD6',
                    fontWeight: '500',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                  }}
                >
                  <Box sx={{ marginTop: '1px' }}>Dropped Out</Box>
                  <ErrorOutlineIcon style={{ fontSize: '13px' }} />
                </Box>
              </Box>
            </Box>
          </Box>
          <MoreVertIcon
            onClick={toggleDrawer('bottom', true)}
            sx={{ fontSize: '24px', color: '#1F1B13' }}
          />
        </Box>
        <BottomDrawer
          toggleDrawer={toggleDrawer}
          state={state}
          setState={setState}
        />
      </Box>
    </>
  );
};

export default CenterList;
