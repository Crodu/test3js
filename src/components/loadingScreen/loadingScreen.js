const LoadingScreen = ({visible}) => {
  return (
    visible && (
      <div style={{
        position: 'absolute', 
        top: 0, left: 0, 
        width: '100vw', height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        background: 'black', 
        color: 'white',
        zIndex: 2,
        }}>
        <h1>Loading...</h1>
      </div>
    )
  );
};

export default LoadingScreen;