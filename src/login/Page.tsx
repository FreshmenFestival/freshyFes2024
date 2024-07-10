import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

enum Department {
  MATHCOM = "ภาคคณิตศาสตร์และวิทยาการคอมพิวเตอร์",
  MARINE = "ภาควิทยาศาสตร์ทางทะเล",
  CHEM = "ภาคเคมี",
  CHEMTECH = "ภาคเคมีเทคนิค",
  BIO = "ภาคชีววิทยา",
  BIOCHEM = "ภาคชีวเคมี",
  BSAC = "ภาคเคมีประยุกต์",
  BBTECH = "ภาคเทคโนโลยีชีวภาพ",
  FOODTECH = "ภาคเทคโนโลยีทางอาหาร",
  MATSCI = "ภาควัสดุศาสตร์",
  PHYSICS = "ภาคฟิสิกส์",
  BOTGEN = "ภาคพฤกษศาสตร์",
  MICROBIO = "ภาคจุลชีววิทยา",
  PHOTO = "ภาควิทยาศาสตร์ทางภาพถ่าย",
  GEO = "ภาคธรณีวิทยา",
  ENVI = "ภาควิทยาศาสตร์สิ่งแวดล้อม",
}

type DepartmentKey = keyof typeof Department;

const getEnumValues = (enumObj: typeof Department) => {
  return (Object.keys(enumObj) as Array<DepartmentKey>).map((key) => ({
    key,
    value: enumObj[key],
  }));
};

interface LoginProps {
  onLogin: (data: { uid: string; group: string; name:string; }) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState<Department | "">("");
  const [error, setError] = useState("");
  const [errorID, setErrorID] = useState("");

  const handleLogin = async () => {
    try {
      const q = query(
        collection(db, "memberlist"),
        where("uid", "==", studentId)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data() as { uid: string; group: string; name:string; };
        onLogin(userData);
      } else {
        setError("ไม่พบข้อมูล กรุณาลองอีกครั้ง");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError("Error checking credentials: " + err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleID = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentId(e.target.value);
  };

  const handleIDBlur = () => {
    if (studentId.length !== 10) {
      setErrorID("รหัสนิสิตไม่ถูกต้อง");
      setStudentId("");
    } else {
      setErrorID("");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-200 ">
      <div className="bg-white p-8 rounded-lg shadow-md w-80 font-noto-sans">
        <h3 className="text-center text-2xl font-semibold mb-6">เข้าสู่ระบบ</h3>

        <div className="flex flex-col mb-4">
          <label className="block text-sm mb-2">รหัสนิสิต</label>
          <input
            type="text"
            placeholder="67xxxxxx23"
            value={studentId}
            onChange={handleID}
            onBlur={handleIDBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-pink-500"
          />
          {errorID && <p className="text-red-500 text-sm">{errorID}</p>}
        </div>

        <div className="flex flex-col mb-4">
          <label className="block text-sm mb-2">ชื่อเล่น</label>
          <input
            type="text"
            placeholder="ใจ่ใจ๊"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-pink-500"
          />
        </div>

        <div className="flex flex-col mb-6">
          <label className="block text-sm mb-2">ภาควิชา</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value as Department)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-pink-500"
          >
            <option value="" disabled>
              เลือกภาควิชา
            </option>
            {getEnumValues(Department).map((dept) => (
              <option key={dept.key} value={dept.value}>
                {dept.value}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition duration-300"
        >
          ยืนยัน
        </button>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
