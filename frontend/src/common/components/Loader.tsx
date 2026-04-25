"use client";

import { ClipLoader } from "react-spinners";

interface LoaderProps {
  size?: number;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ size = 40, fullScreen = false }) => {
  const loader = <ClipLoader size={size} color="#000000" />;

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-[300px] w-full">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;
