"use client";
import { useRef, useState } from "react";

const useImageUpload = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [htmlResponse, setHtmlResponse] = useState<string>("");

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
    event: React.ChangeEvent<HTMLInputElement>,
    email: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("email", email);

      try {
        const response = await fetch(`/api/predict`, {
          method: "POST",
          body: formData,
        });
        const result = await response.json(); // Cambiar a JSON para obtener la respuesta completa
        setHtmlResponse(result.html); // Guardar la respuesta HTML en el estado
        drawImageOnCanvas(result.imagen.image); // Dibujar la imagen en el canvas
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return { canvasRef, handleImageUpload, htmlResponse };
};

export default useImageUpload;
