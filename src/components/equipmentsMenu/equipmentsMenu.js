import React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Fab } from '@mui/material';

const EquipmentsMenu = ({buttonEl, onSelect}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (action) => {
    onSelect(action)
    handleClose()
  }

  const CustomButton = buttonEl ? buttonEl : Fab

  return (
    <div>
      <CustomButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Dashboard
      </CustomButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        anchorOrigin={
          { vertical: 'bottom', horizontal: 'right' }
        }
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => handleSelect('addequip')}>Excavator</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
}

export default EquipmentsMenu;