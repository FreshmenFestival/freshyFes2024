
import { useState } from "react";
// import dashboard from "./Dashboard"

const getMobileOperatingSystem = () => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return "iOS";
  }

  return "unknown";
};

const ShakeComponent = () => {
  const [count, setCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);

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
      
      acceleration = 0.4 * acceleration + delta;

      console.log(`Acceleration: x=${x}, y=${y}, z=${z}, total=${acceleration}`);

      if (acceleration > 22) { // Use the smoothed acceleration value
        if (!isShaking) {
          setCount((prevCount) => prevCount + 1);
          setIsShaking(true);
        }
      } 

    }
  };

  const handleRequestMotion = async () => {
    const mobile = getMobileOperatingSystem();
    if (mobile === "iOS") {
      if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
        try {
          const permissionStatus = await (DeviceMotionEvent as any).requestPermission();
          if (permissionStatus === "granted") {
            window.addEventListener("devicemotion", handleMotion as EventListener);
            setPermissionRequested(true);
          } else {
            alert("Permission not granted");
          }
        } catch (error) {
          console.error("Error requesting DeviceMotion permission:", error);
        }
      } else {
        alert("DeviceMotionEvent.requestPermission is not supported on this device.");
      }
    } else if(mobile === "Android") {
      window.addEventListener("devicemotion", handleMotion as EventListener);
      setPermissionRequested(true);
    } else {
      
    }
  };

  return (
    <div>
      <p>Shake count: {count}</p>
      {!permissionRequested && (
        <button onClick={handleRequestMotion}>start</button>
      )}

      
    </div>
  );
};

export default ShakeComponent;

/*
import { useState, useEffect } from "react";

// ฟังก์ชันตรวจสอบระบบปฏิบัติการของมือถือ
const getMobileOperatingSystem = () => {
  var userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  // ตรวจสอบ Windows Phone
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  // ตรวจสอบ Android
  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // ตรวจสอบ iOS
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return "iOS";
  }

  // กรณีไม่ตรงกับระบบปฏิบัติการใดๆ
  return "unknown";
};

const ShakeComponent = () => {
  const [count, setCount] = useState(0); // นับการเขย่า
  const [permissionRequested, setPermissionRequested] = useState(false); // สถานะการขอสิทธิ์

  let lastX = 0, lastY = 0, lastZ = 0; // ค่าความเร่งล่าสุดในแกน x, y และ z
  let shakeThreshold = 20; // ค่าที่กำหนดไว้เพื่อเป็น threshold ของการเขย่า

  // ฟังก์ชันจัดการการเคลื่อนไหวของอุปกรณ์
  const handleMotion = (event: DeviceMotionEvent) => {
    const acc = event.accelerationIncludingGravity;
    if (acc && acc.x !== null && acc.y !== null && acc.z !== null) {
      const deltaX = Math.abs(acc.x - lastX);
      const deltaY = Math.abs(acc.y - lastY);
      const deltaZ = Math.abs(acc.z - lastZ);

      if ((deltaX > shakeThreshold && deltaY > shakeThreshold) || (deltaX > shakeThreshold && deltaZ > shakeThreshold) || (deltaY > shakeThreshold && deltaZ > shakeThreshold)) {
        setCount((prevCount) => prevCount + 1);
      }

      lastX = acc.x;
      lastY = acc.y;
      lastZ = acc.z;
    }
  };

  // ฟังก์ชันขอสิทธิ์การใช้งานการเคลื่อนไหว
  const handleRequestMotion = async () => {
    const mobile = getMobileOperatingSystem();
    if (mobile === "iOS") {
      if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
        try {
          const permissionStatus = await (DeviceMotionEvent as any).requestPermission();
          if (permissionStatus === "granted") {
            window.addEventListener("devicemotion", handleMotion as EventListener);
            setPermissionRequested(true);
          } else {
            alert("Permission not granted");
          }
        } catch (error) {
          console.error("Error requesting DeviceMotion permission:", error);
        }
      } else {
        alert("DeviceMotionEvent.requestPermission is not supported on this device.");
      }
    } else if (mobile === "Android") {
      window.addEventListener("devicemotion", handleMotion as EventListener);
      setPermissionRequested(true);
    } else {
      alert("Device not supported.");
    }
  };

  // ล้าง event listener เมื่อ component ถูกทำลาย
  useEffect(() => {
    return () => {
      window.removeEventListener("devicemotion", handleMotion as EventListener);
    };
  }, []);

  return (
    <div>
      <p>Shake count: {count}</p>
      {!permissionRequested && (
        <button onClick={handleRequestMotion}>Start</button>
      )}
    </div>
  );
};

export default ShakeComponent;
*/

