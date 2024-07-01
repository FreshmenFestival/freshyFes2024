import { useState } from "react";

const getMobileOperatingSystem = () => {
  var userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

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

  const handleMotion = (event: DeviceMotionEvent) => {
    const acceleration = event.accelerationIncludingGravity;
    if (acceleration && acceleration.x !== null && acceleration.y !== null && acceleration.z !== null) {
      const totalAcceleration = Math.abs(acceleration.x) + Math.abs(acceleration.y) + Math.abs(acceleration.z);
      console.log(`Acceleration: x=${acceleration.x}, y=${acceleration.y}, z=${acceleration.z}, total=${totalAcceleration}`);
      if (totalAcceleration >25) { //แก้ math ตรงนี้ด้วยนะจ๊ะ
        if (!isShaking) {
          setCount((prevCount) => prevCount + 1);
          setIsShaking(true);
        }
      } else {
        setIsShaking(false);
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
    } else {
      window.addEventListener("devicemotion", handleMotion as EventListener);
      setPermissionRequested(true);
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
