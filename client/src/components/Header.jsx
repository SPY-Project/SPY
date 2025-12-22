import React from 'react';

const Header = () => {
  return (
    <header className="bg-[#F3F7FF] py-6 px-4 shadow-sm w-full">
  <div className="w-full flex flex-col items-center justify-center ">
    <img
    src="/spy.jpg"
          // src="/SPY-horizontalfinal1.png"
      // src="/SPY-horizontalfinal1n.png"
      // src="/SPY-horizontal.png"
      alt="SPY Logo"
      // className="h-17 object-cover"
      className="h-[120px] object-contain"
      aria-label="SPY Logo"
    />
  </div>
</header>

  );
};

export default Header;