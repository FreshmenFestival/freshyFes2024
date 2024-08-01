import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from '../App';
import ComDashboard from '../../comDashboard/Page';
import ClosedPage from '../../components/closed';
import { useEffect } from 'react';


function Routing() {



  const initializeScores = () => {
    localStorage.removeItem("token")
  };

  useEffect(() => {
    initializeScores();
  }, []); 


  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<ComDashboard />} />

        <Route path="/testclosed" element={<ClosedPage />} />

      </Routes>
      
    </Router>
  );
}

export default Routing;

/*

  useEffect(() => {
    const checkToken = async () => {
      const token = await createToken("6634416423", "7", "ไอทีเทส", "ไอทีเก่งมาก");
      localStorage.setItem("token", token);
      const data: UserData = { uid: "6634416423", group: "7", name: "ไอทีเทส" };
      setUserData(data);
    };
    checkToken();
  }, []);

   const [showDashboard, setShowDashboard] = useState(false);

  

  const handleShowDashboard = () => {
    setShowDashboard(true);
  };

  const handleBack = () => {
    setShowDashboard(false);
  };

  const [userData, setUserData] = useState<UserData | null>(null);
        <Route path="/test" element={ userData ? ( <ShakeComponent userData={userData} 
        onShowDashboard={handleShowDashboard} /> ) : ( <div>Loading...</div> )} />
                <Route path="/dashboardNong" element={<Dashboard onBack={handleBack}/>} />
                {showDashboard && <Dashboard onBack={handleBack} />}
                */