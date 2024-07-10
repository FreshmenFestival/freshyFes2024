import { useState, useEffect } from "react";
import Login from "../login/Page";
import ShakeComponent from "../components/Shake";
import { createToken, decodeToken } from "../utils/auth";
import { UserData } from "../utils/constant";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

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
