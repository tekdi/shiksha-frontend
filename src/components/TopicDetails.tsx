import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from '@mui/material';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

const TopicDetails = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  return (
    <>
      <Box sx={{ padding: '8px 16px' }}>
        <Box
          sx={{ background: '#FBF4E4', borderRadius: '16px', padding: '16px' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Box>Topic</Box>
              <Box>Real Numbers</Box>
            </Box>
            <EditIcon />
          </Box>

          <Box>Sub Topic</Box>
          <Box>Revisiting Irrational Numbers</Box>
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
      </Box>

      <Accordion
        // defaultExpanded
        sx={{
          boxShadow: 'none !important',
          border: 'none !important',
          mt: 1.5,
        }}
      >
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon sx={{ color: '#1F1B13' }} />}
          aria-controls="panel1-content"
          id="panel1-header"
          className="accordion-summary"
          sx={{ m: 0, background: '#F1E7D9', px: '16px' }}
        >
          <Typography fontWeight="500" fontSize="14px" color={'#1F1B13'}>
            Facilitators Pre-requisites
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: '0px', background: '#fff' }}>
          <Grid container spacing={2} sx={{ px: '16px !important' }}>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <Box className="facilitator-bg">
                <Box>Title</Box>
                <Box>Video</Box>
              </Box>
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <Box className="facilitator-bg">
                <Box>Title</Box>
                <Box>Video</Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box className="facilitator-bg">
                <Box>Title</Box>
                <Box>Video</Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box className="facilitator-bg">
                <Box>Title</Box>
                <Box>Video</Box>
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default TopicDetails;
