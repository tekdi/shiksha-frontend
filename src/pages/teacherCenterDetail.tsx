import Box from '@mui/material/Box';
import Header from '@/components/Header';
import React from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const teacherCenterDetail = () => {
  const [value, setValue] = React.useState('one');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <>
      <Header />{' '}
      <Box sx={{ width: '100%' }}>
        <Tabs
          className="shreyas"
          value={value}
          onChange={handleChange}
          textColor="inherit" // Use "inherit" to apply custom color
          aria-label="secondary tabs example"
          sx={{
            fontSize: '14px',
            borderBottom: '1px solid #EBE1D4',
            '& .MuiTab-root': {
              color: '#4D4639',
            },
            '& .Mui-selected': {
              color: '#4D4639',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#FDBE16',
              borderRadius: '100px',
              height: '3px',
            },
            '& .MuiTabs-scroller': {
              overflowX: 'unset !important',
            },
          }}
        >
          <Tab value="one" label="Item One" />
          <Tab value="two" label="Item Two" />
          <Tab value="three" label="Item Three" />
        </Tabs>
      </Box>
      <Box>{value === 'one' && <Box>sam</Box>}</Box>
    </>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

export default teacherCenterDetail;
