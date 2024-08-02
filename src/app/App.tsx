import { useState, useEffect } from "react";
import Login from "../login/Page";
import { createToken, decodeToken } from "../utils/auth";
import { UserData } from "../utils/constant";
import Dashboard from "../Dashboard/Page";
import ShakeComponent from "../components/Shake";
import PDPA from "../components/pdpa";
import GiftStaff from "../components/Staff";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showStaff, setShowStaff] = useState(false);
  const [pdpaAccepted, setPdpaAccepted] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      localStorage.removeItem("token");
      const token = localStorage.getItem("_token");
      console.log(token)
      if (token !== null) {
        console.log("Kuay")
        try {
          const decoded = await decodeToken(token);
          setUserData(decoded);
          setIsAuthenticated(true);
          setPdpaAccepted(true);
        } catch (err) {
          console.error("Token verification failed:", err);
          localStorage.removeItem("token");
          localStorage.removeItem("_token");
        }
      }
    };

    checkToken();
  }, []);

  const handleLogin = async (data: UserData, nickName: string) => {
    const token = await createToken(data.uid, data.group, data.name, nickName);
    localStorage.removeItem("token");
    localStorage.setItem("_token", token);
    setUserData(data);
    setIsAuthenticated(true);
    localStorage.setItem("nickname", nickName);
  };

  const handleAcceptPDPA = () => {
    setPdpaAccepted(true);
  };

  const handleShowDashboard = () => {
    setShowDashboard(true);
  };

  const handleStaff = () => {
    setShowStaff(true);
  };

  const handleBack = () => {
    setShowDashboard(false);
  };

  const handleBackStaff = () => {
    setShowStaff(false);
  }

  return (
    <div>
      {!isAuthenticated  ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          {showDashboard ? (
            <Dashboard onBack={handleBack} />
          ): showStaff ? (
            <GiftStaff onBack={handleBackStaff} />
          ) : pdpaAccepted ? (
            <ShakeComponent
              userData={userData as UserData}
              onShowDashboard={handleShowDashboard}
              onShowStaff={handleStaff}
            />
          ) : (
            <PDPA onAccept={handleAcceptPDPA} />
          )}
        </>
      )}
    </div>
  );
};

export default App;
