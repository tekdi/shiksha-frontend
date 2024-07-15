import {
  Button,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { formatSelectedDate, getTodayDate, toPascalCase } from '@/utils/Helper';

import AddIcon from '@mui/icons-material/Add';
import AddLeanerModal from '@/components/AddLeanerModal';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import CenterSessionModal from '@/components/CenterSessionModal';
import CohortLearnerList from '@/components/CohortLearnerList';
import { CustomField } from '@/utils/Interfaces';
import DeleteCenterModal from '@/components/center/DeleteCenterModal';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { GetStaticPaths } from 'next';
import Header from '@/components/Header';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlannedSession from '@/components/PlannedSession';
import RenameCenterModal from '@/components/center/RenameCenterModal';
import Schedule from '@/components/Schedule';
import { Session } from '../../utils/Interfaces';
import SessionCard from '@/components/SessionCard';
import SessionCardFooter from '@/components/SessionCardFooter';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import WeekCalender from '@/components/WeekCalender';
import { getCohortDetails } from '@/services/CohortServices';
import { getSessions } from '@/services/Sessionservice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

const TeachingCenterDetails = () => {
  const [value, setValue] = React.useState(1);
  const [showDetails, setShowDetails] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [classId, setClassId] = React.useState('');
  const router = useRouter();
  const { cohortId }: any = router.query;
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const [selectedDate, setSelectedDate] =
    React.useState<string>(getTodayDate());
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [cohortDetails, setCohortDetails] = React.useState<any>({});
  const [reloadState, setReloadState] = React.useState<boolean>(false);
  const [sessions, setSessions] = React.useState<Session[]>();
  const [percentageAttendanceData, setPercentageAttendanceData] =
    React.useState<any>(null);
  const [openRenameCenterModal, setOpenRenameCenterModal] =
    React.useState(false);
  const [openDeleteCenterModal, setOpenDeleteCenterModal] =
    React.useState(false);

  useEffect(() => {
    const getCohortData = async () => {
      const response = await getCohortDetails(cohortId);
      console.log(response);

      let cohortData = null;

      if (response?.cohortData?.length) {
        cohortData = response?.cohortData[0];

        if (cohortData?.customField?.length) {
          const district = cohortData.customField.find(
            (item: CustomField) => item.label === 'District'
          );
          const state = cohortData.customField.find(
            (item: CustomField) => item.label === 'State'
          );

          cohortData.address =
            `${toPascalCase(district?.value)}, ${toPascalCase(state?.value)}` ||
            '';
        }
        setCohortDetails(cohortData);
      }
    };
    getCohortData();
  }, [cohortId]);

  useEffect(() => {
    const getSessionsData = async () => {
      const response: Session[] = await getSessions(cohortId); // Updated to use dynamic cohortId
      setSessions(response);
    };

    getSessionsData();
  }, [cohortId]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleBackEvent = () => {
    window.history.back();
  };

  const showDetailsHandle = (dayStr: string) => {
    setSelectedDate(formatSelectedDate(dayStr));
    setShowDetails(true);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRenameCenterClose = () => {
    setOpenRenameCenterModal(false);
  };

  const handleDeleteCenterClose = () => {
    setOpenDeleteCenterModal(false);
  };

  return (
    <>
      <Header />
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'left',
            color: '#4D4639',
            padding: '15px 17px 5px',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={handleBackEvent}
          >
            <KeyboardBackspaceOutlinedIcon
              sx={{ color: theme.palette.warning['A200'], marginTop: '15px' }}
            />
            <Box m={'1rem 1rem 0.5rem'} display={'column'} gap={'5px'}>
              <Typography textAlign={'left'} fontSize={'22px'}>
                {cohortDetails?.name}
              </Typography>
              {cohortDetails?.centerType && (
                <Typography textAlign={'left'} fontSize={'22px'}>
                  {cohortDetails?.centerType}
                </Typography>
              )}
              <Box>
                <Typography
                  textAlign={'left'}
                  fontSize={'11px'}
                  fontWeight={500}
                >
                  {cohortDetails?.address}
                </Typography>
              </Box>
            </Box>
          </Box>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            sx={{ color: theme.palette.warning['A200'] }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                setOpenRenameCenterModal(true);
                handleMenuClose();
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.warning['A200'] }}>
                <ModeEditOutlineOutlinedIcon fontSize="small" />
              </ListItemIcon>
              {t('CENTERS.RENAME_CENTER')}
            </MenuItem>
            <MenuItem
              onClick={() => {
                setOpenDeleteCenterModal(true);
                handleMenuClose();
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.warning['A200'] }}>
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </ListItemIcon>
              {t('CENTERS.REQUEST_TO_DELETE')}
            </MenuItem>
          </Menu>
          <RenameCenterModal
            open={openRenameCenterModal}
            handleClose={handleRenameCenterClose}
          />
          <DeleteCenterModal
            open={openDeleteCenterModal}
            handleClose={handleDeleteCenterClose}
          />
        </Box>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit"
          aria-label="secondary tabs example"
          sx={{
            fontSize: '14px',
            borderBottom: '1px solid #EBE1D4',
            '& .MuiTab-root': {
              color: '#4D4639',
              padding: '0 20px',
            },
            '& .Mui-selected': {
              color: '#4D4639',
            },
            '& .MuiTabs-indicator': {
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: theme.palette.primary.main,
              borderRadius: '100px',
              height: '3px',
            },
            '& .MuiTabs-scroller': {
              overflowX: 'unset !important',
            },
          }}
        >
          <Tab value={1} label={t('COMMON.CENTER_SESSIONS')} />
          <Tab value={2} label={t('COMMON.LEARNER_LIST')} />
        </Tabs>
      </Box>

      {value === 1 && (
        <>
          <Box mt={3} px={'18px'}>
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
              onClick={handleOpen}
            >
              {t('COMMON.SCHEDULE_NEW')}
            </Button>

            <CenterSessionModal
              open={open}
              handleClose={handleClose}
              title={'Schedule'}
              primary={'Next'}
            >
              <PlannedSession />
            </CenterSessionModal>
          </Box>
          <Box mt={3} px={'18px'}>
            <Box
              className="fs-14 fw-500"
              sx={{ color: theme.palette.warning['300'] }}
            >
              {t('COMMON.UPCOMING_EXTRA_SESSION')}
            </Box>
            <Box
              className="fs-12 fw-400 italic"
              sx={{ color: theme.palette.warning['300'] }}
            >
              {t('COMMON.NO_SESSIONS_SCHEDULED')}
            </Box>
          </Box>
          <Box sx={{ padding: '10px 16px' }}>
            <WeekCalender
              showDetailsHandle={showDetailsHandle}
              data={percentageAttendanceData}
              disableDays={classId === 'all' ? true : false}
              classId={classId}
            />
          </Box>
          <Box mt={3} px="18px">
            {sessions &&
              sessions.map((item: Session, index: number) => (
                <SessionCard data={item} key={item.id}>
                  <SessionCardFooter item={item} />
                </SessionCard>
              ))}
          </Box>
        </>
      )}
      <Box>
        {value === 2 && (
          <>
            <Box mt={3} px={'18px'}>
              <Button
                sx={{
                  border: '1px solid #1E1B16',
                  borderRadius: '100px',
                  height: '40px',
                  width: '126px',
                  color: theme.palette.error.contrastText,
                }}
                className="text-1E"
                endIcon={<AddIcon />}
                onClick={handleOpen}
              >
                {t('COMMON.ADD_NEW')}
              </Button>
            </Box>
            <Box
              px={'18px'}
              mt={2}
              sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}
            >
              <Box
                sx={{ color: theme.palette.secondary.main }}
                className="fs-14 fw-500"
                onClick={() => {
                  router.push('/attendance-overview');
                }}
              >
                {t('COMMON.REVIEW_ATTENDANCE')}
              </Box>
              <ArrowForwardIcon
                sx={{ fontSize: '18px', color: theme.palette.secondary.main }}
              />
            </Box>
            <Box>
              <CohortLearnerList
                cohortId={cohortId}
                reloadState={reloadState}
                setReloadState={setReloadState}
              />
            </Box>
          </>
        )}
        <AddLeanerModal
          learnersName={[
            'Aanya Gupta',
            'Aakash Sen',
            'Aisha Bhatt',
            'Ananya Umesh',
            'Bhavana Gill',
          ]}
        />
      </Box>
    </>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default TeachingCenterDetails;
