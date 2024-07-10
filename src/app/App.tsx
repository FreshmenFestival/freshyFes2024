import  { useState, useEffect } from 'react';
import Login from '../login/Page';
import ShakeComponent from '../components/Shake';
import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

interface UserData {
  uid: string;
  group: string;
  name: string;
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload & UserData;
        setUserData(decoded);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Token verification failed:', err);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogin = (data: UserData) => {
    const token = jwt.sign(data, SECRET_KEY, { algorithm: 'HS256', expiresIn: '7d' });
    localStorage.setItem('token', token);
    setUserData(data);
    setIsAuthenticated(true);
  };

  return (
    <div>
      {isAuthenticated && userData ? (
        <div className="text-center">
          <ShakeComponent userData={userData} />
          <h3>25 V.5.2</h3>
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
