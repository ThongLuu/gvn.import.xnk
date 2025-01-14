import React from "react";
import Backdrop from "./backdrop";

const Loader = () => {
  return (
    <Backdrop open={true}>
      <div className="relative flex items-center justify-center w-16 h-16">
        <div className="absolute w-full h-full border-4 border-current rounded-full animate-ping opacity-50"></div>
        <div className="absolute w-full h-full border-4 border-current rounded-full animate-ping delay-150"></div>
      </div>
    </Backdrop>
  );
};

export default Loader;
