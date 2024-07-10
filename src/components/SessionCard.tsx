import { Box, Typography } from '@mui/material';
import { Session, SessionsCardProps } from '@/utils/Interfaces';

import EditOutlined from '@mui/icons-material/EditOutlined';
import React from 'react';
import { useTheme } from '@mui/material/styles';

const SessionsCard: React.FC<SessionsCardProps> = ({ data, children }) => {
  const theme = useTheme<any>();
  return (
    <>
      <Box
        sx={{
          border: `1px solid ${theme.palette.warning['A100']}`,
          borderRadius: '8px',
          marginBottom: '16px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 16px',
          }}
        >
          <Box>
            <Typography
              color={theme.palette.warning['300']}
              fontWeight={'400'}
              textAlign={'left'}
              fontSize={'16px'}
            >
              {data?.subject}
            </Typography>

            <Typography fontWeight={'400'} textAlign={'left'} fontSize={'14px'}>
              {data?.time}
            </Typography>
            <Typography fontWeight={'400'} textAlign={'left'} fontSize={'14px'}>
              {data?.teacherName}
            </Typography>
          </Box>
          <EditOutlined />
        </Box>
        <Box>{children}</Box>
      </Box>
    </>
  );
};

export default SessionsCard;