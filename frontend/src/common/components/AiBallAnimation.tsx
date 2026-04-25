"use client";

import Lottie from "lottie-react";
import animationData from "../../../public/lottie/animation.json";

export default function AiBallAnimation({ className }: { className?: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center flex-1 min-h-0">
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        className={className}
      />
    </div>
  );
}
