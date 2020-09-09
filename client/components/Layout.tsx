import React from 'react';
import Link from 'next/link';
const Layout: React.FC = ({ children }) => {
  return (
    <div className="my-0 mx-auto  max-w-md ">
      <Link href="/">
        <a className="block  w-64 my-0 mx-auto py-0 px-4">
          <img src="/logo.svg" alt="logo" />
        </a>
      </Link>
      {children}
    </div>
  );
};

export default Layout;
