"use client";
import { useRef } from "react";

const useImageUpload = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawImageOnCanvas = (base64Image: string) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const image = new Image();
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        ctx?.drawImage(image, 0, 0);
      };
      image.src = `data:image/jpeg;base64,${base64Image}`;
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://127.0.0.1:8000/detect_image", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        console.log(result);
        drawImageOnCanvas(result.image);
      } catch (error: any) {
        console.error(error);
      }
    }
  };

  return { canvasRef, handleImageUpload };
};

export default useImageUpload;
