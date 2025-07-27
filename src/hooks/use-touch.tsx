import { useEffect, useState } from "react";

export default function useTouch() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
    check();
  }, []);

  return isTouch;
}
