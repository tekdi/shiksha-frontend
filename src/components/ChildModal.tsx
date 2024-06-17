import * as React from 'react';

import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { Theme, useTheme } from '@mui/material/styles';

import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'next-i18next';

interface ChildModalProps {
  open: boolean;
  onClose: (confirmed: boolean) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Unable to cope with studies',
  'Family responsibilities',
  'Need to go to work / own work',
  'Marriage',
  'Illness',
  'Migration',
  'Pregnancy',
  'Document issue',
  'Distance issue',
  'School admission',
];

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function DropOutModal({ open, onClose }: ChildModalProps) {
  const [personName, setPersonName] = React.useState<string[]>([]);
  const { t } = useTranslation();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    boxShadow: 24,
    bgcolor: '#fff',
    borderRadius: '24px',
    '@media (min-width: 600px)': {
      width: '450px',
    },
  };

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };
  const theme = useTheme<any>();

  return (
    <React.Fragment>
      <Modal
        open={open}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style }}>
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            sx={{ padding: '18px 16px' }}
          >
            <Box marginBottom={'0px'}>
              <Typography
                variant="h2"
                sx={{
                  color: theme.palette.warning['A200'],
                  fontSize: '14px',
                }}
                component="h2"
              >
                {t('COMMON.DROP_OUT')}
              </Typography>
            </Box>
            <CloseIcon
              sx={{
                cursor: 'pointer',
                color: theme.palette.warning['A200'],
              }}
              onClick={() => onClose(false)}
            />
          </Box>
          <Divider />
          <Box sx={{ padding: '10px 18px' }}>
            <FormControl sx={{ mt: 1, width: '100%' }}>
              <InputLabel
                sx={{ fontSize: '16px', color: theme.palette.warning['300'] }}
                id="demo-multiple-name-label"
              >
                Reason for Dropout
              </InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput label="Reason for Dropout" />}
                MenuProps={MenuProps}
              >
                {names.map((name) => (
                  <MenuItem
                    sx={{
                      fontSize: '16px',
                      color: theme.palette.warning['300'],
                    }}
                    key={name}
                    value={name}
                    style={getStyles(name, personName, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box mt={1.5}>
            <Divider />
          </Box>
          <Box p={'18px'}>
            <Button
              className="w-100"
              sx={{ boxShadow: 'none' }}
              variant="contained"
              onClick={() => onClose(true)}
            >
              {t('COMMON.ADD_NEW')}
            </Button>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default DropOutModal;
