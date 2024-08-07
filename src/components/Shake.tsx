import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { useState, useRef } from "react";
import { db } from "../firebase";

const getMobileOperatingSystem = () => {
  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera;

  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return "iOS";
  }

  return "unknown";
};

interface UserData {
  name: string;
  group: string;
  uid: string;
}

interface ShakeComponentProps {
  userData: UserData;
  onShowDashboard: () => void;
  onShowStaff: () => void;
}

const ShakeComponent: React.FC<ShakeComponentProps> = ({
  userData,
  onShowDashboard,
  onShowStaff
}) => {
  const [count, setCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [isPLaying, setIsPlaying] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const lastTickRef = useRef(new Date());
  const lastCountRef = useRef(count);

  let lastAcceleration = 9.81;
  let acceleration = 0;

  const handleMotion = (event: DeviceMotionEvent) => {
    const acc = event.accelerationIncludingGravity;
    if (acc && acc.x !== null && acc.y !== null && acc.z !== null) {
      const x = acc.x;
      const y = acc.y;
      const z = acc.z;

      const currentAcceleration = Math.hypot(x, y, z);
      const delta = currentAcceleration - lastAcceleration;
      lastAcceleration = currentAcceleration;
      acceleration = 0.9 * acceleration + delta;

      console.log(
        "Acceleration: x=${x}, y=${y}, z=${z}, total=${acceleration}"
      );

      if (acceleration > 15 && !isShaking) {
        setCount((prevCount) => {
          const nowTick = new Date();

          if (nowTick.getTime() - lastTickRef.current.getTime() < 200) {
            return prevCount;
          }

          const newCount = prevCount + 1;

          lastTickRef.current = nowTick;
          lastCountRef.current = newCount;
          return newCount;
        });
        setIsShaking(true);
        setIsPlaying(true);
        setIsBouncing(true);
      }
    }
  };

  const handleStop = async () => {
    window.removeEventListener("devicemotion", handleMotion as EventListener);
    setIsPlaying(false);

    const s = query(
      collection(db, "scores"),
      where("group", "==", userData.group),
      where("group", "!=", "7")
    );
    

    try {
      if (userData.group == "7") {
        console.log("staff");
        onShowStaff();
      } else {
        const querySnapshot = await getDocs(s);
        if (!querySnapshot.empty) {
          querySnapshot.forEach(async (doc) => {
            const newScore = (doc.data().score || 0) + count;
            await updateDoc(doc.ref, { score: newScore });
          });
        } else {
          await addDoc(collection(db, "scores"), {
            group: userData.group,
            score: count,
          });
        }
        onShowDashboard();
      }
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  };

  const group = () => {
    switch (userData.group) {
      case "1":
        return <span className="text-orange-500">Monorabian</span>;
      case "2":
        return <span className="text-green-600">Edenity</span>;
      case "3":
        return <span className="text-purple-600">Tartarus</span>;
      case "4":
        return <span className="text-pink-500">Avalon</span>;
      case "5":
        return <span className="text-yellow-800">Lyford</span>;
      case "6":
        return <span className="text-blue-500">Atlansix</span>;
      case "7":
        return <span className="text-amber-900">Staff</span>;
    }
  };

  const evoImg = () => {
    if (count < 100) {
      return "/gift2.png";
    } else if (count < 300) {
      return "/babyTiger.png";
    } else if (count < 500) {
      return "Tiger2.png";
    } else if (count < 10000) {
      return "Tiger3.png";
    } else {
      return secretIMG();
    }
  };

  const secretIMG = () => {
    switch (userData.group) {
      case "1":
        return "/secret/group1.jpg";
      case "2":
        return "/secret/group2.jpg";
      case "3":
        return "/secret/group3.jpg";
      case "4":
        return "/secret/group4.jpg";
      case "5":
        return "/secret/group5.jpg";
      case "6":
        return "/secret/group6.jpg";
      case "7":
        return "/secret/Oat.png";
    }
  };

  const handleRequestMotion = async () => {
    const mobile = getMobileOperatingSystem();
    if (mobile === "iOS") {
      if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
        try {
          const permissionStatus = await (
            DeviceMotionEvent as any
          ).requestPermission();
          if (permissionStatus === "granted") {
            window.addEventListener(
              "devicemotion",
              handleMotion as EventListener
            );
            setPermissionRequested(true);
          } else {
            alert("Permission not granted");
          }
        } catch (error) {
          alert("Error requesting DeviceMotion permission:" + error);
        }
      } else {
        alert(
          "DeviceMotionEvent.requestPermission is not supported on this device."
        );
      }
    } else if (mobile === "Android") {
      window.addEventListener("devicemotion", handleMotion as EventListener);
      setPermissionRequested(true);
    }
  };

  const nickNamefromlocal = localStorage.getItem("nickname");

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-phone bg-contain font-alice">
      <div className="m-4 gap-4 flex justify-end">
        <div className="font-alice sm:col-span-2 min-h-[50px] text-base rounded-lg justify-center align-center float-right">
          <h3 className="text-amber-900 font-prompt text-center">
            <b>{nickNamefromlocal}</b>
          </h3>
          <h4 className="text-center">
            <b>{group()}</b>{" "}
          </h4>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <img
          key={Math.random()}
          src={evoImg()}
          className={`h-[150px] ${isBouncing ? "animate-bounceonce" : ""}`}
        />

        <h2 className="text-amber-900">
          <b>Shake count: {count}</b>
        </h2>

        {!permissionRequested && (
          <div className="relative">
            <button
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded-full focus:outline-none"
              onTouchEnd={handleRequestMotion}
            >
              Start
            </button>
          </div>
        )}

        {isPLaying && (
          <div>
            <button
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full focus:outline-none"
              onTouchEnd={handleStop}
            >
              Stop
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShakeComponent;
