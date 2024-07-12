import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

const PlannedSession = () => {
  const [sessionMode, setSessionMode] = useState('Offline');

  const handleSessionModeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSessionMode(event.target.value);
  };

  const { t } = useTranslation();
  const theme = useTheme<any>();

  return (
    <>
      <Box sx={{ padding: '10px 16px' }}>
        <Box>
          <FormControl>
            <FormLabel
              id="demo-row-radio-buttons-group-label"
              style={{ color: '#1F1B13' }}
            >
              Mode of Session
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={sessionMode}
              onChange={handleSessionModeChange}
            >
              <FormControlLabel
                value="Offline"
                control={<Radio style={{ color: '#1F1B13' }} />}
                label={<span style={{ color: '#1F1B13' }}>Offline</span>}
              />
              <FormControlLabel
                value="Online"
                control={<Radio style={{ color: '#1F1B13' }} />}
                label={<span style={{ color: '#1F1B13' }}>Online</span>}
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Subject</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Subject"
            >
              <MenuItem value={'Mathematics'}>Mathematics</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {sessionMode === 'Online' && (
          <>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Meeting Link
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Meeting Link"
                >
                  <MenuItem value={'Link1'}>Link 1</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Meeting Passcode (if applicable)
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Meeting Passcode"
                >
                  <MenuItem value={'Passcode1'}>Passcode 1</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </>
        )}

        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid sx={{ paddingTop: '0px !important' }} item xs={6}>
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Start Time
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Start Time"
                  >
                    <MenuItem value={'Time1'}>Time 1</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid sx={{ paddingTop: '0px !important' }} item xs={6}>
              <Box sx={{ my: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    End Time
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="End Time"
                  >
                    <MenuItem value={'Time2'}>Time 2</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid sx={{ paddingTop: '0px !important' }} item xs={6}>
              <Box>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Start Date
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Start Date"
                  >
                    <MenuItem value={'Date1'}>Date 1</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid sx={{ paddingTop: '0px !important' }} item xs={6}>
              <Box>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    End Date
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="End Date"
                  >
                    <MenuItem value={'Date2'}>Date 2</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: '5px',
            mt: 2,
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              fontSize: '14px',
              color: '#0D599E',
              fontWeight: '500',
            }}
          >
            Remove this session
          </Box>
          <DeleteOutlineIcon sx={{ fontSize: '18px', color: '#BA1A1A' }} />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Divider />
        </Box>

        <Divider />

        <Box mt={2.5} mb={2}>
          <Button
            sx={{
              border: `1px solid ${theme.palette.error.contrastText}`,
              borderRadius: '100px',
              height: '40px',
              width: '163px',
              color: theme.palette.error.contrastText,
            }}
            className="text-1E"
            endIcon={<AddIcon />}
          >
            {t('COMMON.SCHEDULE_NEW')}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default PlannedSession;
