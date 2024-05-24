"use client";
import React from "react";
import useImageUpload from "@/hooks/useImageUpload";
import { Input } from "@/components/ui/input";

const ImageUpload: React.FC = () => {
  const { canvasRef, handleImageUpload } = useImageUpload();
  console.log(canvasRef.current);
  return (
    <div>
      <div className="cursor-pointer flex flex-col gap-3">
        <Input type="file" onChange={handleImageUpload} accept="image/*" />
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};

export default ImageUpload;
