"use client";

import * as Craft from "@/components/craft";
import { Input } from "@/components/ui/input";
import useImageUpload from "@/hooks/useImageUpload";
import Placeholder from "@/public/placeholder.jpg";
import Image from "next/image";
import { useState, useEffect } from "react";

const Feature = () => {
  const { canvasRef, handleImageUpload } = useImageUpload();
  const [email, setEmail] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    await handleImageUpload(event, email);
  };

  return (
    <Craft.Section>
      <Craft.Container className="grid md:grid-cols-2 md:gap-12 items-stretch">
        <div className="flex flex-col gap-6 py-8">
          <h3 className="!my-0">Detector Acne</h3>
          <p className="font-light leading-[1.4] opacity-70">
            Carga una imagen de su rostro para detectar los puntos de acné.
          </p>
          <div className="not-prose flex flex-col items-center gap-2">
            <Input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={handleEmailChange}
              required
            />
            <Input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
          </div>
        </div>
        <div className="not-prose border relative rounded-lg overflow-hidden flex h-96">
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          ></canvas>
        </div>
      </Craft.Container>
    </Craft.Section>
  );
};

export default Feature;
