
import React from "react";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-16 h-16 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
