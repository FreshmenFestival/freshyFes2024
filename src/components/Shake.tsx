import { useState, useEffect, useCallback } from "react";

const ShakeComponent = () => {
  const [count, setCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);

  const handleMotion = useCallback(
    (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (acc && acc.x !== null && acc.y !== null && acc.z !== null) {
        const x = acc.x;
        const y = acc.y;
        const z = acc.z;

        const currentAcceleration = Math.sqrt(x * x + y * y + z * z);
        const delta = currentAcceleration - 9.81; // Adjust according to your needs

        console.log(
          `Acceleration: x=${x}, y=${y}, z=${z}, total=${currentAcceleration}`
        );

        if (delta > 1 && !isShaking) {
          // Adjust threshold and conditions as needed
          setCount((prevCount) => prevCount + 1);
          setIsShaking(true);

          // Reset shaking state after 2 seconds
          setTimeout(() => {
            setIsShaking(false);
          }, 2000);
        }
      }
    },
    [isShaking]
  );

  const handleRequestMotion = async () => {
    const mobile = getMobileOperatingSystem();
  
    if (mobile === "iOS" && typeof DeviceMotionEvent.requestPermission === "function") {
      try {
        const permissionStatus = await DeviceMotionEvent.requestPermission();
        if (permissionStatus === "granted") {
          window.addEventListener("devicemotion", handleMotion);
          setPermissionRequested(true);
        } else {
          alert("Permission not granted");
        }
      } catch (error) {
        alert("Error requesting DeviceMotion permission: " + error);
      }
    } else if (mobile === "Android") {
      window.addEventListener("devicemotion", handleMotion);
      setPermissionRequested(true);
    } else {
      alert("Motion detection is not supported on this device.");
    }
  };
  
  useEffect(() => {
    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [handleMotion]);

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
