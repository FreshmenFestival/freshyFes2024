import React, { useState } from 'react';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../firebase';

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const q = query(collection(db, "users"), where("studentId", "==", studentId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log(studentId);
        onLogin();
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError("Error checking credentials: " + err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };


  return (
    <div>
      <h3>Log-in</h3>
      <div>
        <p>รหัสนิสิต</p>
        <input type="text" placeholder="67xxxxxx23" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
        <p>ชื่อ-สกุล</p>
        <input type="text" placeholder="นายสมใจ ที่หนึ่ง" value={name} onChange={(e) => setName(e.target.value)} />
        <p>ภาควิชา</p>
        <input type="text" placeholder="ภาควิชา" value={department} onChange={(e) => setDepartment(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
