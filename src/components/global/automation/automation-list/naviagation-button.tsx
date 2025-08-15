import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

const NavigateButton = ({ onNavigate }: { onNavigate: () => void }) => (
  <Button
    onClick={(e) => {
      e.stopPropagation();
      onNavigate();
    }}
    variant="ghost"
    className="group/btn flex items-center justify-center text-[10px] sm:text-[11px] rounded-md px-3 border bg-gray-500/15 border-gray-500 hover:bg-blue-500/15 hover:border-blue-500 shadow-lg transition-all duration-300"
  >
    <span className="text-gray-400 group-hover/btn:text-blue-500 transition-colors duration-300">
      Go to
    </span>
    <MoveRight className="ml-1 text-gray-400 group-hover/btn:text-blue-500 transition-colors duration-300" />
  </Button>
);

export default NavigateButton;
