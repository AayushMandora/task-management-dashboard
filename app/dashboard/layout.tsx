"use client";
import { useRouter } from "next/navigation";

import NavBar from "@/components/NavBar/NavBar";
import Footer from "@/components/Footer/Footer";

import "../globals.css";
import { useEffect } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const route = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      route.push("/");
    }
  });

  return (
    <div>
      <NavBar />
      <div className="h-[80vh] overflow-auto">{children}</div>
      <Footer />
    </div>
  );
}
