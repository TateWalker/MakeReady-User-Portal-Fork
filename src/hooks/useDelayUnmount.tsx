import React, { useEffect, useState } from "react";

export default function useDelayUnmount(isMounted: boolean, delayTime: number) {
  const [hasTransitioned, setHasTransitioned] = useState(false);
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isMounted && !hasTransitioned) {
      setHasTransitioned(true);
    } else if (!isMounted && hasTransitioned) {
      timeoutId = setTimeout(() => setHasTransitioned(false), delayTime);
    }
    return () => clearTimeout(timeoutId);
  }, [isMounted, delayTime, hasTransitioned]);
  return hasTransitioned;
}
