import { useState } from "react";

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

const ShakeComponent: React.FC<{ userData: UserData }> = ({ userData }) => {
  const [count, setCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [isPLaying, setIsPlaying] = useState(false);

  let lastAcceleration = 9.81;
  let acceleration = 0;

  const handleMotion = (event: DeviceMotionEvent) => {
    const acc = event.accelerationIncludingGravity;
    if (acc && acc.x !== null && acc.y !== null && acc.z !== null) {
      const x = acc.x;
      const y = acc.y;
      const z = acc.z;

      const currentAcceleration = Math.sqrt(x * x + y * y + z * z);
      const delta = currentAcceleration - lastAcceleration;
      lastAcceleration = currentAcceleration;

      acceleration = 0.45 * acceleration + delta;

      console.log(
        `Acceleration: x=${x}, y=${y}, z=${z}, total=${acceleration}`
      );

      if (acceleration > 15 && !isShaking) {
        setCount((prevCount) => prevCount + 1);
        setIsShaking(true);
        setIsPlaying(true)
      }
    }
  };

  const handleStop = () => {
    window.removeEventListener("devicemotion", handleMotion as EventListener);
    setIsPlaying(false);

  };

  const group = () => {
    switch(userData.group) {
      case "1" :
        return ("MonoRabian");
      case "2" :
        return ("MonoRabian");
      case "3" :
        return ("MonoRabian");
      case "4" :
        return ("MonoRabian");
      case "5" :
        return ("MonoRabian");
      case "6" :
        return ("MonoRabian");
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
      <div className="">
        <p>ชื่อเล่น: {userData.name}</p>
        <p>ชื่อกรุ๊ป: {userData.group}</p>
      </div>
      <div className="relative">
        <img src="shake.png" alt="profile" className="w-32 h-32 rounded-full mx-auto border-4 border-white" />
      </div>
      <div className="flex flex-col justify-center item-center ">
        <p>Shake count: {count}</p>
        {!permissionRequested && (
          <button
            className="mt-4 px-6 py-2 bg-gray-500 text-white rounded-full focus:outline-none"
            onClick={handleRequestMotion}
          >
            Start
          </button>
        )}
        {isPLaying && (
          <button
          className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full focus:outline-none"
          onClick={handleStop}
        >
          Stop
        </button>
        )}
      </div>
    </div>
  );
};

export default ShakeComponent;
