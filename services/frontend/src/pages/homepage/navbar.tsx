"use client";
import React, { useState } from "react";
import { Menu } from "lucide-react";
import clsx from "clsx";

const NavBar = () => {
  const [isVisible, setVisible] = useState(false);
  return (
    <div className="flex justify-between bg-gray-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <a href="./" className="p-3 mx-4 font-extrabold text-3xl font-mono tracking-wider hover:text-violet-400 transition duration-300">
        IMS
      </a>
      <div className="hidden sm:flex gap-6 items-center text-lg">
        <a href="./" className="hover:text-violet-400 transition duration-300">Home</a>
        <a href="https://github.com/NagaRohithKumarJakkala/IMS" className="hover:text-violet-400 transition duration-300">GitHub</a>
        <a href="./" className="hover:text-violet-400 transition duration-300">About</a>
        <a href="./login" className="text-white bg-violet-500 px-4 py-2 rounded-full hover:bg-violet-700 transition duration-300 shadow-md">
          Login/Sign Up
        </a>
      </div>
      <Menu className="block sm:hidden cursor-pointer" onClick={() => setVisible(!isVisible)} />
      <div className={clsx(isVisible ? "block" : "hidden", "absolute right-4 top-16 bg-gray-800 p-4 rounded shadow-lg")}>
        <a href="./" className="block p-2 hover:text-violet-400">Home</a>
        <a href="https://github.com/NagaRohithKumarJakkala/IMS" className="block p-2 hover:text-violet-400">GitHub</a>
        <a href="./" className="block p-2 hover:text-violet-400">About</a>
        <a href="./login" className="block p-2 bg-violet-500 rounded text-center hover:bg-violet-700">Login/Sign Up</a>
      </div>
    </div>
  );
};
export default NavBar;



// "use client";
// import React, { useState } from "react";
// import { Menu } from "lucide-react";
// import clsx from "clsx";

// const NavBar = () => {
//   const [isVisible, setVisible] = useState(0);
//   function showmenu(): void {
//     if (isVisible == 0) {
//       setVisible(1);
//     } else {
//       setVisible(0);
//     }
//   }
//   return (
//     <div id="nav" className="flex justify-between bg-gray-950 border border-gray-900 p-3 sticky z-10">
//     {/* <div className="bg-gradient-to-br from-violet-600 via-slate-900 to-violet-200 text-white text-center p-6"> */}
//       <a href="./" id="logo" className="p-3 mx-4 font-bold text-3xl font-mono">
//         IMS
//       </a>
//       <div className="hidden sm:block">
//         <div id="items" className="flex gap-4 flex-row justify-between text-lg">
//           <a href="./" className="p-3">
//             Home
//           </a>
//           {/* <a href="./templates" className="p-3">
//             Templates
//           </a> */}
//           <a
//             href="https://github.com/NagaRohithKumarJakkala/IMS"
//             className="p-3"
//           >
//             Github
//           </a>
//           <a href="./" className="p-3">
//             About
//           </a>
//           <a href="./login" className="text-sky-500 border border-sky-500 border-double bg-white p-3 rounded-full hover:bg-gradient-to-r hover:from-violet-200 hover:to-violet-600 hover:text-white hover:font-sans hover:border-transparent hover:shadow-xl hover:scale-95 transition duration-200">
//             Login/SignUp
//           </a>
//         </div>
//       </div>
//       <Menu className="block m-4 sm:hidden" onClick={showmenu} />
//       <div
//         className={clsx(
//           isVisible ? "block" : "hidden",
//           " absolute right-4 top-16 border border-white rounded bg-black",
//         )}
//       >
//         <a href="./" className="block border p-4 border-white ">
//           Home
//         </a>
//         {/* <a href="./templates" className="block border p-4 border-white ">
//           Templates
//         </a> */}
//         <a
//           href="https://github.com/NagaRohithKumarJakkala/IMS"
//           className="block border p-4  border-white "
//         >
//           Github
//         </a>
//         <a href="./" className="block border p-4 border-white ">
//           About
//         </a>
//         <a href="./login" className="block border p-4 border-white ">
//           Login/SignUp
//         </a>
//       </div>
//     </div>
//   );
// };

// export default NavBar;
