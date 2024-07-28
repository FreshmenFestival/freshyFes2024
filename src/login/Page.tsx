import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

enum Department {
  MATHCOM = "ภาควิชาคณิตศาสตร์และวิทยาการคอมพิวเตอร์",
  MARINE = "ภาควิชาวิทยาศาสตร์ทางทะเล",
  CHEM = "ภาควิชาเคมี",
  CHEMTECH = "ภาควิชาเคมีเทคนิค",
  BIO = "ภาควิชาชีววิทยา",
  BIOCHEM = "ภาควิชาชีวเคมี",
  BSAC = "หลักสูตรเคมีประยุกต์ (BSAC)",
  BBTECH = "หลักสูตรเทคโนโลยีชีวภาพ (BBTECH)",
  FOODTECH = "ภาควิชาเทคโนโลยีทางอาหาร",
  MATSCI = "ภาควิชาวัสดุศาสตร์",
  PHYSICS = "ภาควิชาฟิสิกส์",
  BOTGEN = "ภาควิชาพฤกษศาสตร์",
  MICROBIO = "ภาควิชาจุลชีววิทยา",
  PHOTO = "ภาควิชาวิทยาศาสตร์ทางภาพถ่าย",
  GEO = "ภาควิชาธรณีวิทยา",
  ENVI = "ภาควิชาวิทยาศาสตร์สิ่งแวดล้อม",
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
  const [checking, setChecking] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  const handleLogin = async () => {
    try {
      const q = query(
        collection(db, "memberlist"),
        where("uid", "==", studentId)
      );
      setChecking(true);
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data() as { uid: string; group: string; name:string; };
        onLogin(userData);
      } else {
        setChecking(false);
        if (firstLoad) {
          setFirstLoad(false);
        } else {
          setError("Noppo! ! ! Try again ;P ");
        }
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

  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-phone bg-contain ">
      { checking ? (
        <img className="animate-spin h-18 w-18" src="/progress_amber.png"></img>
      ) : (
        <div className="text-amber-900 rounded-2xl  w-80">
          <h1 className="text-center text-3xl font-alice mb-2"><b>Welcome to</b></h1>
          <h1 className="text-center text-2xl font-alice mb-2"><b>Vidya Freshmen Festival</b></h1>
          <h1 className="text-center text-3xl font-alice mb-2"><b>The Myths of Yggdrasil</b></h1>
          <div className="flex flex-col font-playfair mb-2">
            <label className="mt-4 block text-base font-alice">Student ID</label>
            <input
              type="text"
              placeholder="67xxxxxx23"
              value={studentId}
              onChange={handleID}
              onBlur={handleIDBlur}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-tranparent
              focus:outline-none focus:border-amber-900"
            />
            {errorID && <p className="text-red-500 text-sm">{errorID}</p>}
          </div>

          <div className="flex flex-col mb-2 font-playfair">
            <label className="block text-base ">Name</label>
            <input
              type="text"
              placeholder="ใจ่ใจ๊"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:border-amber-900"
            />
          </div>

          <div className="flex flex-col mb-2 font-playfair">
            <label className="block text-base">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value as Department)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:border-amber-900"
            >
              <option value="" disabled>
                Department
              </option>
              {getEnumValues(Department).map((dept) => (
                <option key={dept.key} value={dept.value}>
                  {dept.value}
                </option>
              ))}
            </select>
          </div>

          <button
            onTouchStart={handleLogin}
            className="mt-4 w-full bg-amber-900 text-white py-2 rounded-md hover:bg-amber-700 transition duration-300 font-playfair"
          >
            Accept
          </button>
          {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

        </div>
      )}
    </div>
  );
};

export default Login;
