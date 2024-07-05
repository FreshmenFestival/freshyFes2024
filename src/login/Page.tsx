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
  onLogin: () => void;
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
        collection(db, "demoStudent"),
        where("uid", "==", studentId)
      );
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
    <div>
      <h3>Log-in</h3>

      <div>
        <p>รหัสนิสิต</p>
        <input
          type="text"
          placeholder="67xxxxxx23"
          value={studentId}
          onChange={handleID}
          onBlur={handleIDBlur}
        />
        {errorID && <p style={{ color: "red" }}>{errorID}</p>}
        <p>ชื่อ-สกุล</p>
        <input
          type="text"
          placeholder="นายสมใจ ที่หนึ่ง"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p>ภาควิชา</p>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value as Department)}
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
        <button onClick={handleLogin}>Submit</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
