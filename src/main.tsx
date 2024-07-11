import React from 'react';
import ReactDOM from 'react-dom/client';
import { isMobile } from 'react-device-detect';
import App from './app/App';
import ComDashboard from './comDashboard/Page';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);
// สำหรับ desktop ไว้ใส่ตอนหลัง
// {isMobile ? <App /> : <ComDashboard />}