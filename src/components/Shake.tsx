import { collection, getDocs, query, where, updateDoc, addDoc } from "firebase/firestore";
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
}

const ShakeComponent: React.FC<ShakeComponentProps> = ({ userData, onShowDashboard }) => {
  const [count, setCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [isPLaying, setIsPlaying] = useState(false);
  const [isCountChange, setIsCountChange] = useState(false);
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
        `Acceleration: x=${x}, y=${y}, z=${z}, total=${acceleration}`
      );

      if (acceleration > 30 && !isShaking) {
        setCount((prevCount) => {
          const nowTick = new Date();
          
          if (nowTick.getTime() - lastTickRef.current.getTime() < 200) {
            setIsCountChange(false);
            return prevCount;
          }
          
          setIsCountChange(true);
          const newCount = prevCount + 1;

          lastTickRef.current = nowTick;
          lastCountRef.current = newCount;
          return newCount;
        });
        setIsShaking(true);
        setIsPlaying(true);
      }
    }
  };

  const handleStop = async () => {
    window.removeEventListener("devicemotion", handleMotion as EventListener);
    setIsPlaying(false);

    const s = query(
      collection(db, "scores"),
      where("group", "==", userData.group)
    );
  
    try {
      const querySnapshot = await getDocs(s);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const newScore = (doc.data().score || 0) + count;
          updateDoc(doc.ref, { score: newScore });
        });
      } else {
        await addDoc(collection(db, "scores"), {
          group: userData.group,
          score: count
        });
      }
      onShowDashboard();
    } catch (error) {
      console.error("Error writing document: ", error);
    }

  };

  const group = () => {
    switch(userData.group) {
      case "1" :
        return (
          <span className="text-orange-500">MonoRabian</span>
        );
      case "2" :
        return (
          <span className="text-green-600">Edenity</span>
        );
      case "3" :
        return (
          <span className="text-purple-600">Tartarus</span>
        );
      case "4" :
        return (
          <span className="text-pink-500">Avalon</span>
        );
      case "5" :
        return (
          <span className="text-yellow-800">Lyford</span>
        );
      case "6" :
        return (
          <span className="text-blue-500">Atlansix</span>
        );
      case "7" :
        return (
          <span className=" " >Staff</span>
        );
    }

  }

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

  return (
    
    <div className="flex flex-col items-center justify-center h-screen gap-2">
      <div className="m-4 gap-4 ">
        <div className="font-serif sm:col-span-2 min-h-[50px] text-4xl rounded-lg shadow bg-zinc-200 inline-block align-middle" > {userData.name} 
          <p className="font-serif text-3xl text-center" > {group()} </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 ">
        {!permissionRequested && (
          <div className="relative">
            <div className="animate-bounce text-l " > tap <span className="uppercase">THE BUTTON</span> to start shaking</div>
            <img src="https://i.postimg.cc/q7nVS7tw/red-button-png.webp" 
                alt="profile" 
                className="w-40 h-40 rounded-full mx-auto  border-4 border-white " 
                onClick={handleRequestMotion} 
            />
          </div>
        )}

        {isPLaying && (
          <div>
            <div className={`${isCountChange ? 'w-30 h-30' : 'w-20 h-20'} bg-sky-600 rounded-full relative`}></div>
            <p>Shake count: {count}</p>
            <button className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full focus:outline-none" onClick={handleStop}>
              Stop
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShakeComponent;
