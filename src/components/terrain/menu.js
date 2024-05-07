import React, { useState } from 'react';
import styles from './styles.module.css';
import { Card, Fab } from '@mui/material';
import EquipmentsMenu from '../equipmentsMenu/equipmentsMenu';



const Toolbar = ({handleAction}) => {

  const [equipMenuOpen, setEquipMenuOpen] = useState(null)

  const handleClick = (e, action, type) => {
    if (type === 'menu') {
      return setEquipMenuOpen(e.currentTarget)
    } return handleAction(action)
  }

  const ToolbarButton = ({text, action, type=null, ...props}) => {
    return (
      <Fab 
        sx={{margin: '10px'}}
        className={'menuButton'}
        onClick={(e) => handleClick(e, action, type)}
        color='primary'
        {...props}
      >
        {text}
      </Fab>
    );
  }

  return (
    <Card
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#f0f0f0',
        padding: '10px',
        margin: '25px',
        borderRadius: '5px',
        display: 'flex',
        zIndex: 1,
      }}
    >
        <ToolbarButton
          text="Camera"
          action="camera"
        />
        <ToolbarButton
          text="Line"
          action="line"
        />
        <ToolbarButton
          text="Cancel"
          action="clear"
        />
        <EquipmentsMenu 
          onSelect={(action) => handleAction(action)}
          buttonEl={(props) => (
            <ToolbarButton
              text="Add..."
              action="add"
              type="menu"
              {...props}	
            />
          )}
        />
        <ToolbarButton
          text="Animate"
          action="clear"
        />
        
    </Card>
  );
};

export default Toolbar;