import React from "react";

const Animation = () => {
  return (
    <div className="hidden lg:flex relative h-full w-1/2 items-center justify-center bg-gray-200">
      <div className="w-60 h-60 bg-gradient-to-tr from-violet-500 to-pink-500 rounded-full animate-spin" />
      <div className="w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg" />
    </div>
  );
};

export default Animation;