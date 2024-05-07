import React from 'react';



const Toolbar = ({handleAction}) => {

  const ToolbarButton = ({text, action}) => {
    return (
      <button
        style={{
          borderRadius: '50%',
          backgroundColor: 'gray',
          border: 'none',
          width: '60px',
          height: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => handleAction(action)}
      >
        {text}
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#f0f0f0',
        padding: '10px',
        margin: '25px',
        borderRadius: '5px',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
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
        text="Button"
        action="button"
       />
    </div>
  );
};

export default Toolbar;