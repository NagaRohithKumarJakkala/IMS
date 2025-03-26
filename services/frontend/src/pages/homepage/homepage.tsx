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
      <div className="max-w-full bg-[url('/space.webp')] h-[40vh] flex flex-col justify-center items-center">
        <div className="text-9xl italic rounded-full">IMS</div>
        <div className="sm:text-2xl">A way to manage your inventory</div>
      </div>
      <div>
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
      </div>
      <div className="grid sm:grid-cols-12 border border-white m-10">
        <div className="min-h-[200px] border border-white m-5 sm:order-2  sm:col-span-6 lg:col-span-4">
          <Image
            src="/black.png"
            alt="alternate image"
            width={50}
            height={50}
          ></Image>
        </div>
        <div className="min-h-[200px] m-5 sm:order-1  sm:col-span-6 lg:col-span-8">
          manage your services with easy to connnect and beautiful ui.This IMS
          provides you flexibility and easy creation of your things which is
          useful to you.
        </div>
      </div>
      <div className="grid sm:grid-cols-12 border border-white m-10">
        <div className="min-h-[200px] border border-white m-5 sm:col-span-6 lg:col-span-4">
          <Image
            src="/black.png"
            alt="alternate image"
            width={50}
            height={50}
          ></Image>
        </div>
        <div className="min-h-[200px] m-5  sm:col-span-6 lg:col-span-8">
          manage your services with easy to connnect and beautiful ui.This IMS
          provides you flexibility and easy creation of your things which is
          useful to you.
        </div>
      </div>
      <div className="m-10 min-h-[300] border border-white">
        <h2 className="m-5 text-center text-2xl underline">Some heading</h2>
        <div className="m-5">
          Using the order property will create a disconnect between the visual
          presentation of content and DOM order. This will adversely affect low
          vision users navigating with the aid of assistive technology such as a
          screen reader. If the visual order differs from the DOM order, your
          users will have different experiences depending on how they access
          your content.
        </div>
      </div>
      <div className=" m-10 border border-white grid grid-cols-1 sm:grid-cols-3 lg:mx-96">
        <div className="border border-white m-5">
          <Image
            src="/black.png"
            alt="alt image"
            width={300}
            height={300}
          ></Image>
        </div>
        <div className="border border-white m-5">
          <Image
            src="/black.png"
            alt="alt image"
            width={300}
            height={300}
          ></Image>
        </div>
        <div className="border border-white m-5">
          <Image
            src="/black.png"
            alt="alt image"
            width={300}
            height={300}
          ></Image>
        </div>
        <div className="m-10 sm:col-span-3">
          <h2 className="text-center text-2xl underline">ShowCase</h2>
          <div>
            Using the order property will create a disconnect between the visual
            presentation of content and DOM order. This will adversely affect
            low vision users navigating with the aid of assistive technology
            such as a screen reader. If the visual order differs from the DOM
            order, your users will have different experiences depending on how
            they access your content.
          </div>
        </div>
      </div>
      <div className="footer min-h-[400px] border border-weight m-10 text-center">
        footer
      </div>
    </div>
  );
};

export default HomePage;
