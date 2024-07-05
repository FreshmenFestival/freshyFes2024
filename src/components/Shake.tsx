import { useState, useEffect, useCallback, useRef } from "react";

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

const ShakeComponent = () => {
  const [count, setCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);

  const lastAccelerationRef = useRef(9.81); // Using useRef to store lastAcceleration

  const accelerationRef = useRef(0); // Using useRef to store acceleration

  const handleMotion = useCallback(
    (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (acc && acc.x !== null && acc.y !== null && acc.z !== null) {
        const x = acc.x;
        const y = acc.y;
        const z = acc.z;

        const currentAcceleration = Math.sqrt(x * x + y * y + z * z);
        const delta = currentAcceleration - lastAccelerationRef.current;
        lastAccelerationRef.current = currentAcceleration;

        accelerationRef.current = 0.45 * accelerationRef.current + delta;

        console.log(
          `Acceleration: x=${x}, y=${y}, z=${z}, total=${accelerationRef.current}`
        );

        if (accelerationRef.current > 15 && !isShaking) {
          setCount((prevCount) => prevCount + 1);
          setIsShaking(true);
        }
      }
    },
    [isShaking]
  ); // Dependency added to useCallback

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
          alert("Error requesting DeviceMotion permission: " + error);
        }
      } else {
        alert(
          "DeviceMotionEvent.requestPermission is not supported on this device."
        );
      }
    } else if (mobile === "Android") {
      window.addEventListener("devicemotion", handleMotion as EventListener);
      setPermissionRequested(true);
    } else {
      alert("Motion detection is not supported on this device.");
    }
  };

  useEffect(() => {
    // Clean up event listener
    return () => {
      window.removeEventListener("devicemotion", handleMotion as EventListener);
    };
  }, [handleMotion]); // Dependency added to useEffect

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
