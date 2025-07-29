import { useEffect, useState } from "react";

export default function useTouch() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkPrimaryInput = () => {
      // Method 1: Check if hover is supported (most reliable)
      const canHover = window.matchMedia("(hover: hover)").matches;
      const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

      // Method 2: Check for touch capability but prioritize hover capability
      const hasTouchCapability =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      // Primary touch device: has touch AND (no hover OR coarse pointer)
      const isPrimaryTouchDevice =
        hasTouchCapability && (!canHover || hasCoarsePointer);

      setIsTouch(isPrimaryTouchDevice);
    };

    checkPrimaryInput();

    // Optional: Listen for changes in media queries
    const hoverMediaQuery = window.matchMedia("(hover: hover)");
    const pointerMediaQuery = window.matchMedia("(pointer: coarse)");

    const handleChange = () => checkPrimaryInput();

    hoverMediaQuery.addEventListener("change", handleChange);
    pointerMediaQuery.addEventListener("change", handleChange);

    return () => {
      hoverMediaQuery.removeEventListener("change", handleChange);
      pointerMediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return isTouch;
}
