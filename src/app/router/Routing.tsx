import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from '../App';
import ComDashboard from '../../comDashboard/Page';
import ClosedPage from '../../components/closed';
import ShakeComponent from '../../components/Shake';
import { useEffect, useState } from 'react';
import { createToken } from '../../utils/auth';
import { UserData } from '../../utils/constant';
import Dashboard from '../../Dashboard/Page';

function Routing() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await createToken("6634416423", "7", "ไอทีเทส", "ไอทีเก่งมาก");
      localStorage.setItem("token", token);
      const data: UserData = { uid: "6634416423", group: "7", name: "ไอทีเทส" };
      setUserData(data);
    };
    checkToken();
  }, []);

  const handleShowDashboard = () => {
    setShowDashboard(true);
  };

  const handleBack = () => {
    setShowDashboard(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<ComDashboard />} />
        <Route path="/testclosed" element={<ClosedPage />} />
        <Route path="/test" element={ userData ? ( <ShakeComponent userData={userData} 
        onShowDashboard={handleShowDashboard} /> ) : ( <div>Loading...</div> )} />
      </Routes>
      {showDashboard && <Dashboard onBack={handleBack} />}
    </Router>
  );
}

export default Routing;
