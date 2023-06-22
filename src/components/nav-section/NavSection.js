import { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';

// @mui
import { Box, List, ListItemText } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';
// ----------------------------------------------------------------------

export default function NavSection({ data = [], ...other }) {
  console.log(data, 'data');

  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => {
          if (item.type === 'text') {
            return <NavItem key={item.title} item={item} />
          }
          if (item.type === 'dropdown') {
            return <NavItems key={item.title} item={item} />
          }
          return null
        }

        )}
      </List>
    </Box>
  );
}

function NavItem({ item }) {
  const { title, path, icon, info } = item;

  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        '&.active': {
          color: 'text.primary',
          bgcolor: 'action.selected',
          fontWeight: 'fontWeightBold',
        },
      }}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

      <ListItemText disableTypography primary={title} />

      {info && info}
    </StyledNavItem>
  );
}

function NavItems({ item }) {
  const { title, path, icon, info } = item;
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(!open)
  }
  return (
    <div style={open ? { background: "#EDEFF1", borderRadius: '6px' } : {}}>
      <StyledNavItem
        onClick={handleOpen}
      >

        <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

        <ListItemText disableTypography primary={title} />

        {info && info}
        {!open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
      </StyledNavItem>
      {open && item.subNav && item.subNav.map((i) => { return <NavItem key={i.title} item={i} /> }
      )}
    </div>

  );
}
