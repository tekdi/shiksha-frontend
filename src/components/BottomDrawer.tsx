import * as React from 'react';

import Box from '@mui/material/Box';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Drawer from '@mui/material/Drawer';
import DropOutModal from './ChildModal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

type Anchor = 'bottom';

interface AnchorTemporaryDrawerProps {
  toggleDrawer: (
    anchor: Anchor,
    open: boolean
  ) => (event: React.MouseEvent) => void;
  state: { [key in Anchor]?: boolean };
  setState: React.Dispatch<React.SetStateAction<{ [key in Anchor]?: boolean }>>;
}

export default function AnchorTemporaryDrawer({
  toggleDrawer,
  state,
  setState,
}: AnchorTemporaryDrawerProps) {
  const [showModal, setShowModal] = React.useState(false);
  const { t } = useTranslation();
  const theme = useTheme<any>();
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
        {[t('COMMON.MARK_DROP_OUT'), t('COMMON.REMOVE_FROM_CENTER')].map(
          (text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                onClick={() => {
                  if (text === 'Mark as Drop Out') {
                    setShowModal(true);
                  }
                }}
                sx={{
                  borderBottom: '1px solid #D0C5B4',
                  padding: '20px',
                  fontSize: '14px',
                  color: theme.palette.warning['300'],
                }}
              >
                <ListItemIcon>
                  {index % 2 === 0 ? (
                    <NoAccountsIcon
                      sx={{ color: theme.palette.warning['300'] }}
                    />
                  ) : (
                    <DeleteOutlineIcon
                      sx={{ color: theme.palette.warning['300'] }}
                    />
                  )}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </Box>
  );

  return (
    <div>
      <DropOutModal open={showModal} onClose={() => setShowModal(false)} />
      {(['bottom'] as Anchor[]).map((anchor) => (
        <React.Fragment key={anchor}>
          <Drawer anchor={anchor} open={state[anchor]} className="modal-bottom">
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
