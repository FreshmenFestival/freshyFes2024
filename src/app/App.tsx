import React, { useState } from 'react';
import Login from '../login/Page';
import ShakeComponent  from '../components/Shake'

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h1>Shake Game</h1>
          <ShakeComponent/>
          <h3>25 V.5.2</h3>
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;



