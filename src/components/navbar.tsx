"use client";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-sm border-b ">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-md font-bold mb-4 md:mb-0">
          Anonymous Feedback
        </a>
        {session ? (
          <>
            {/* <span className="mr-4">Welcome,{user.username || user.email}</span> */}
            <Button onClick={() => signOut()} className="w-full md:w-auto">
              Sign out
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button>Sign in</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
