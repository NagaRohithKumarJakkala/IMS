
"use client";
import { useSession, signOut } from "next-auth/react";
import React from "react";
import NavBar from "./navbar";
import Image from "next/image";

const HomePage = () => {
  const { data: session } = useSession();
  return (
    <div>
      <NavBar />
      <div className="max-w-full bg-[url('/space1.webp')] h-[40vh] flex flex-col justify-center items-center">
        <div className="text-9xl italic rounded-full">IMS</div>
        <div className="sm:text-3xl font-bold">A way to manage your Inventory</div>
      </div>
      {/* <div>
        {session ? (
          <>
            <p>You are logged in as {session.user.name}</p>
            <button
              onClick={() => signOut()}
              style={{ padding: "10px", marginTop: "10px" }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <p>Please log in.</p>
        )}
      </div> */}
      <div className="bg-gradient-to-br from-violet-600 via-slate-900 to-violet-200 text-white text-center p-6">
      <div className="grid sm:grid-cols-12 border border-l-transparent border-r-transparent m-10 rounded-xl shadow-2xl">
        <div className="min-h-[180px] m-5 sm:order-1 sm:col-span-6 lg:col-span-4">
          <Image
            src="/Projects.png"
            alt="alternate image"
            width={450}
            height={450}
          ></Image>
        </div>
        <div className="font-serif font-bold text-white text-2xl italic min-h-[200px] m-5 sm:order-2  sm:col-span-6 lg:col-span-8">
        Experience seamless service management with our intuitive IMS, designed to empower you with effortless connectivity
         and a beautifully crafted interface. Create and customize your workflows with unparalleled flexibility, 
         transforming complex tasks into elegantly simple solutions.
        </div>
      </div>
      <div className="grid sm:grid-cols-12 border border-l-transparent border-r-transparent m-10 rounded-xl shadow-2xl">
        <div className="min-h-[180px] m-5 sm:order-2 sm:col-span-6 lg:col-span-4">
          <Image
            src="/view.png"
            alt="alternate image"
            width={450}
            height={450}
          ></Image>
        </div>
        <div className="font-serif font-bold text-white text-2xl italic min-h-[200px] m-5  sm:order-1 sm:col-span-6 lg:col-span-8">
        Gain comprehensive control over your service landscape with this adaptable IMS. Easily connect and manage your 
        resources, customizing your workflows to achieve peak performance and responsiveness.
        </div>
      </div>
      <div className="m-10 min-h-[300] border border-l-transparent border-r-transparent rounded-xl shadow-2xl">
        <h2 className="m-5 text-center text-3xl font-serif underline">For Clients</h2>
        <div className="text-lg text-left font-thin m-5">
        In the realm of inventory management, providing a uniform, undifferentiated view to all users within an organization 
        can create significant operational challenges. Our IMS addresses this by implementing a sophisticated, role-based 
        access system. When every employee, regardless of their function, is presented with the entirety of inventory data, it 
        results in information overload, reduced efficiency, and potential errors. 
        Our IMS avoids this pitfall by meticulously tailoring the inventory interface to each user's specific role and 
        access level.
        Ensures that each user receives only the information they require to perform their duties 
        effectively, minimizing distractions and maximizing productivity. 
        Our system enhances data security by restricting access to sensitive inventory information based on 
        predefined user roles. This prevents unauthorized personnel from viewing or manipulating critical data, safeguarding
         the integrity of your inventory management processes. By delivering a clean, contextually relevant interface, our 
         IMS empowers your team to work more efficiently, make informed decisions, and maintain optimal inventory control.
        </div>
      </div>
      <div className=" m-10 border border-l-transparent border-r-transparent rounded-xl shadow-2xl grid grid-cols-1 sm:grid-cols-3 lg:mx-96">
        <div className="border border-white m-5">
          <Image
            src="/admin.png"
            alt="alt image"
            width={300}
            height={300}
          ></Image>
        </div>
        <div className="border border-white m-5">
          <Image
            src="/staff.png"
            alt="alt image"
            width={300}
            height={300}
          ></Image>
        </div>
        <div className="border border-white m-5">
          <Image
            src="/user.png"
            alt="alt image"
            width={300}
            height={300}
          ></Image>
        </div>
        {/* <div className="m-10 sm:col-span-3">
          <h2 className="text-center text-2xl underline">ShowCase</h2>
          <div>
            Using the order property will create a disconnect between the visual
            presentation of content and DOM order. This will adversely affect
            low vision users navigating with the aid of assistive technology
            such as a screen reader. If the visual order differs from the DOM
            order, your users will have different experiences depending on how
            they access your content.
          </div>
        </div> */}
      </div>
      <div className="m-10 min-h-[300] border border-l-transparent border-r-transparent rounded-xl shadow-2xl">
      <h2 className="text-3xl font-serif underline mb-4">Contributors</h2>
          {[
            { name: "Naga Rohith Kumar Jakkala", url: "https://github.com/NagaRohithKumarJakkala" },
            { name: "Sai Kaushik P", url: "https://github.com/saikaushhikp" },
            { name: "Vishal Varukolu", url: "https://github.com/Vishal45187" },
            { name: "Sairam Suhas Muvvala", url: "https://github.com/suhas-1012" },
          ].map((contributor, index) => (
            <a
              key={index}
              href={contributor.url}
              className="p-4 underline text-sky-500 hover:shadow-xl hover:scale-105 transition-transform duration-200 block"
            >
              {contributor.name}
            </a>
          ))}
          <div className="text-center text-lg font-sans font-bold mt-4">
            This project is developed by students of IIT Hyderabad under the guidance of
            <a href="https://www.iith.ac.in/cse/shirshendu" className="underline text-sky-500 hover:shadow-md hover:rounded-md transition duration-200"> Dr. Shirshendu Das</a>.
          </div>
      </div>
      </div>
    </div>
  );
};

export default HomePage;
