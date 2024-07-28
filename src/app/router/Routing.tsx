
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from '../App';
import ComDashboard from '../../comDashboard/Page';

function Routing() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<ComDashboard />} />
      </Routes>
    </Router>
  );
}

export default Routing;
