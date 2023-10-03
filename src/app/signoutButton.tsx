"use client";
import { signOut } from "next-auth/react";

const SignoutButton = () => {
  return (
    <button
      onClick={() =>
        signOut({ callbackUrl: "/authwall/sign-in", redirect: true })
      }
      className="px-8 py-2 bg-red-500"
    >
      Sign Out
    </button>
  );
};

export default SignoutButton;
