"use client";
import React from "react";
import ImageUpload from "@/components/ImageUpload";

const HomePage: React.FC = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-start py-10 gap-5">
      <h1 className="text-5xl font-semibold">Detección de Acne</h1>

      <div className="w-full px-20">
        <ImageUpload />
      </div>
    </div>
  );
};

export default HomePage;
