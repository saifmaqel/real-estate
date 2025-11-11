import { SpinLoader } from "react-loadly";
import "react-loadly/styles.css";

interface AppLoaderProps {
  size?: number;
  fullscreen?: boolean;
  color?: string;
  className?: string;
}

export function AppLoader({
  size = 80,
  fullscreen = true,
  color = "#444444",
  className = "items-center justify-center",
}: AppLoaderProps) {
  return (
    <SpinLoader
      fullscreen={fullscreen}
      size={size}
      color={color}
      className={className}
    />
  );
}
