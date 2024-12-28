import { RotateCw } from "lucide-react";

type SpinnerProps = {
  color?: string;
  size?: number;
};
export default function Spinner({ color, size = 16 }: SpinnerProps) {
  return <RotateCw className="animate-spin" size={size} color={color} />;
}
