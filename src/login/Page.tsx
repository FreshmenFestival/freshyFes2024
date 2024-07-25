import React, { useState ,useEffect } from "react";
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
  const [checking, setChecking] = useState(false);

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

  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-phone ">
      { checking ? (
        <img className="animate-spin h-18 w-18" src="/progress_activity.png"></img>
      ) : (
        <div className="text-amber-900 rounded-2xl  w-80">
          <h1 className="text-center text-4xl font-great mb-2"><b>welcome to</b></h1>
          <h1 className="text-center text-5xl mb-6 font-great"><b>Yggdrasil</b></h1>
          <div className="flex flex-col font-alice mb-2">
            <label className="block text-base">Student ID</label>
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

          <div className="flex flex-col mb-2 font-alice">
            <label className="block text-base ">Name</label>
            <input
              type="text"
              placeholder="ใจ่ใจ๊"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:border-amber-900"
            />
          </div>

          <div className="flex flex-col mb-2 font-alice">
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
            className="w-full bg-yellow-700 text-white py-2 rounded-md hover:bg-amber-900 transition duration-300 font-alice"
          >
            accept
          </button>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        </div>
      )}
    </div>
  );
};

export default Login;
