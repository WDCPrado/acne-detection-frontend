"use client";
import { LoginForm } from "@/components/login";
import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <LoginForm />
    </div>
  );
};

export default HomePage;
