import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import App from '../App';
import ComDashboard from '../../comDashboard/Page';
import ClosedPage from '../../components/closed';

function Routing() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClosedPage />} />
        <Route path="/dashboard" element={<ComDashboard />} />
      </Routes>
    </Router>
  );
}

export default Routing;

// <Route path="/testclosed" element={<ClosedPage />} />
// <Route path="/" element={<ClosedPage />} />
// <Route path="/" element={<App />} />