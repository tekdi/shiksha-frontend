'use client';

import { Box, Menu, MenuItem, MenuProps, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { usePathname, useRouter } from 'next/navigation';

import ConfirmationModal from './ConfirmationModal';
import Image from 'next/image';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuDrawer from './MenuDrawer';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import accountIcon from './../assets/images/account.svg';
import dynamic from 'next/dynamic';
import { logEvent } from '@/utils/googleAnalytics';
import logoLight from '../../public/images/logo-light.png';
import menuIcon from '../assets/images/menuIcon.svg';
import { useTranslation } from 'next-i18next';

const Header: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const pathname = usePathname();
  const theme = useTheme<any>();

  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === 'light'
          ? 'rgb(55, 65, 81)'
          : theme.palette.grey[300],
      boxShadow: `
      rgb(255, 255, 255) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
      rgba(0, 0, 0, 0.05) 0px 4px 6px -2px
    `,
      '& .MuiMenu-list': {
        padding: '4px 0',
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        '&:active': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  }));

  const handleProfileClick = () => {
    if (pathname !== '/profile') {
      router.push('/profile');
      logEvent({
        action: 'my-profile-clicked-header',
        category: 'Dashboard',
        label: 'Profile Clicked',
      });
    }
  };
  const handleLogoutClick = () => {
    router.replace('/logout');
    logEvent({
      action: 'logout-clicked-header',
      category: 'Dashboard',
      label: 'Logout Clicked',
    });
  };
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [logout, setLogout] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedLanguage = localStorage.getItem('preferredLanguage');
      if (storedLanguage) {
        setSelectedLanguage(storedLanguage);
      }
    }
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenDrawer(newOpen);
  };

  const logoutOpen = () => {
    setLogout(true);
  };

  const getMessage = () => {
    if (logout) return 'Are you sure you want to Logout?';
    return '';
  };

  const handleAction = () => {
    if (logout) {
      handleLogoutClick();
    }
  };

  return (
    <Box sx={{ marginBottom: '4rem' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          position: 'fixed',
          top: '0px',
          zIndex: '999',
          width: '100%',
          bgcolor: ' #FFFFFF',
          maxWidth: '899px',
        }}
      >
        <Stack
          width={'100%'}
          direction="row"
          justifyContent={'space-between'}
          alignItems={'center'}
          height="64px"
          boxShadow="0px 1px 3px 0px #0000004D"
        >
          <Box
            onClick={toggleDrawer(true)}
            mt={'0.5rem'}
            sx={{ cursor: 'pointer' }}
            paddingLeft={'20px'}
          >
            <Image
              height={12}
              width={18}
              src={menuIcon}
              alt="menu icon"
              style={{ cursor: 'pointer' }}
            />
          </Box>

          <Image
            height={40}
            width={44}
            src={logoLight}
            alt="logo"
            onClick={() => router.push('/dashboard')}
            style={{ cursor: 'pointer' }}
          />

          <Box
            onClick={handleClick}
            sx={{ cursor: 'pointer', position: 'relative' }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : 'false'}
            paddingRight={'20px'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            flexDirection={'column'}
            mt={'0.5rem'}
          >
            <Image
              height={20}
              width={20}
              src={accountIcon}
              alt="account icon"
              style={{ cursor: 'pointer' }}
            />
          </Box>

          <StyledMenu
            id="profile-menu"
            MenuListProps={{
              'aria-labelledby': 'profile-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            {pathname !== '/profile' && (
              <MenuItem
                onClick={handleProfileClick}
                disableRipple
                sx={{ letterSpacing: 'normal' }}
              >
                <PersonOutlineOutlinedIcon />
                {t('PROFILE.MY_PROFILE')}
              </MenuItem>
            )}
            <MenuItem
              onClick={logoutOpen}
              disableRipple
              sx={{ letterSpacing: 'normal' }}
            >
              <LogoutOutlinedIcon />
              {t('COMMON.LOGOUT')}
            </MenuItem>
          </StyledMenu>

          <ConfirmationModal
            logout={logout}
            handleLogoutClick={handleLogoutClick}
            setLogout={setLogout}
            message={getMessage()}
            handleAction={handleAction}
            PrimaryButtonName={'Log Out'}
            seconderyButtonName={'Cancel'}
          />
        </Stack>
      </Box>

      <MenuDrawer
        toggleDrawer={toggleDrawer}
        open={openDrawer}
        language={selectedLanguage}
        setLanguage={setSelectedLanguage}
      />
    </Box>
  );
};

export default Header;
