import React from "react";
import { useUser } from "../lib/hooks";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  const [, { mutate }] = useUser();
  const handleLogout = async () => {
    const res = await fetch("/api/auth", {
      method: "DELETE",
    });
    if (res.status === 204) {
      // set the user state to null
      mutate(null);
      router.replace("/");
    }
  };
  return (
    /* ... */
    <button onClick={handleLogout}>Logout</button>
    /* ... */
  );
};

export default Navbar;
