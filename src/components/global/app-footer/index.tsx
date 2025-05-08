import React from 'react';

const AppFooter = () => {
  return (
    <footer className="fixed z-50 bottom-0 w-full lg:w-10/12 bg-[#09090B]/50 backdrop-blur-sm py-2 flex justify-center items-center gap-x-2">
      <p className="text-center text-sm">
        <small>&copy; Pulse</small> <small>{new Date().getFullYear()}</small>
      </p>
    </footer>
  );
};

export default AppFooter;
