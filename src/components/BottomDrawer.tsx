import * as React from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import DropOutModal from './DropOutModal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

type Anchor = 'bottom';

interface BottomDrawerProps {
  toggleDrawer: (
    anchor: Anchor,
    open: boolean
  ) => (event: React.MouseEvent) => void;
  state: { [key in Anchor]?: boolean };
  text: {
    listName: string;
    icon: React.ReactNode;
  }[];
}

export default function BottomDrawer({
  toggleDrawer,
  state,
  text,
}: BottomDrawerProps) {
  const [showModal, setShowModal] = React.useState(false);
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const handleAction = {
    [t('COMMON.MARK_DROP_OUT')]: () => setShowModal(true),
    [t('COMMON.REMOVE_FROM_CENTER')]: () => {},
  };

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        width: 'auto',
      }}
      role="presentation"
    >
      <Box
        sx={{
          padding: '30px 40px 40px',
          display: 'flex',
          justifyContent: 'center',
        }}
        onClick={toggleDrawer(anchor, false)}
      >
        <Box className="bg-grey"></Box>
      </Box>
      <List>
        {text.map(({ listName, icon }, index) => (
          <ListItem disablePadding key={index}>
            <ListItemButton
              sx={{
                borderBottom: '1px solid #D0C5B4',
                padding: '20px',
                fontSize: '14px',
                color: theme.palette.warning['300'],
              }}
              onClick={() => handleAction[listName]?.()}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={listName} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <DropOutModal open={showModal} onClose={() => setShowModal(false)} />
      <Drawer anchor="bottom" open={state.bottom} className="modal-bottom">
        {list('bottom')}
      </Drawer>
    </div>
  );
}
