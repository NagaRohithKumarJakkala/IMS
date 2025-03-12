import React from "react";
import { Menu } from "lucide-react";

const NavBar = () => {
  return (
    <div
      id="nav"
      className="flex justify-between bg-gray-950 border border-gray-900 p-3 sticky z-10"
    >
      <a href="./" id="logo" className="p-3 mx-4 font-bold text-2xl">
        IMS
      </a>
      <div className="hidden sm:block">
        <div id="items" className="flex gap-4 flex-row justify-between text-lg">
          <a href="./" className="p-3">
            Home
          </a>
          <a href="./" className="p-3">
            Templates
          </a>
          <a
            href="https://github.com/NagaRohithKumarJakkala/IMS"
            className="p-3"
          >
            Github
          </a>
          <a href="./" className="p-3">
            About
          </a>
          <a href="./" className="border border-red-500 p-3">
            SignUP/Login
          </a>
        </div>
      </div>
      <Menu className="block m-4 sm:hidden" />
    </div>
  );
};

export default NavBar;
