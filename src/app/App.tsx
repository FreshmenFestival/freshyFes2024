import { useState, useEffect } from "react";
import Login from "../login/Page";
import { createToken, decodeToken } from "../utils/auth";
import { UserData } from "../utils/constant";
import Dashboard from "../Dashboard/Page";
import ShakeComponent from "../components/Shake";
import ComDashboard from "../comDashboard/Page";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = await decodeToken(token);
          setUserData(decoded);
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Token verification failed:", err);
          localStorage.removeItem("token");
        }
      }
    };

    checkToken();
  }, []);

  const handleLogin = async (data: UserData) => {
    const token = await createToken(data.uid, data.group, data.name);
    localStorage.setItem("token", token);
    setUserData(data);
    setIsAuthenticated(true);
  };

  const handleShowDashboard = () => {
    setShowDashboard(true);
  };

  const handleBack = () => {
    setShowDashboard(false);
  };

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <div>
      
      {isAuthenticated && userData ? (
        showDashboard ? (
          <>
          {isMobile ? <Dashboard userData={userData} onBack={handleBack}/> : <ComDashboard userData={userData}/>}
          </>
        ) : (
          <>
          <ShakeComponent userData={userData} onShowDashboard={handleShowDashboard} />
          </>
        )
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;


