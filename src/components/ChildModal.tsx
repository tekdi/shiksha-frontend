import * as React from 'react';

import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Typography,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Theme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

interface ChildModalProps {
  open: boolean;
  onClose: (confirmed: boolean) => void;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '85%',
  boxShadow: 24,
  bgcolor: '#fff',
  borderRadius: '24px',
  Height: '526px',
  '@media (min-width: 600px)': {
    width: '450px',
  },
};

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
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function ChildModal({ open, onClose }: ChildModalProps) {
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };
  const { t } = useTranslation();
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
                // color: theme.palette.warning['A200'],
              }}
              onClick={() => onClose(false)}
            />
          </Box>
          <Divider />

          <Box sx={{ padding: '10px 18px' }}>
            <FormControl sx={{ mt: 1, width: '100%' }}>
              <InputLabel
                sx={{ fontSize: '16px', color: '#1F1B13' }}
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
                    sx={{ fontSize: '16px', color: '#1F1B13' }}
                    key={name}
                    value={name}
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

          <Box className="w-100" p={'18px'}>
            <Button
              className="w-100"
              sx={{ boxShadow: 'none' }}
              variant="contained"
            >
              {t('COMMON.ADD_NEW')}
            </Button>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default ChildModal;
