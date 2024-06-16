import { NextResponse } from "next/server";
import * as nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const email = formData.get("email") as string;
  console.log(email);

  if (!file || typeof file === "string") {
    return new NextResponse("Invalid file", { status: 400 });
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/detect_image`;

  const response = await fetch(apiUrl, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  const average_confidence = result.average_confidence;

  // Determinar el tipo de tratamiento basado en el promedio de confianza
  let tratamiento = "";
  if (average_confidence < 0.2) {
    tratamiento = "tratamiento liviano";
  } else if (average_confidence >= 0.2 && average_confidence < 0.6) {
    tratamiento = "tratamiento mediano";
  } else if (average_confidence >= 0.6) {
    tratamiento = "tratamiento pesado";
  }

  // Convertir el archivo a base64
  const arrayBuffer = await file.arrayBuffer();
  const base64Image = Buffer.from(arrayBuffer).toString("base64");

  // Enviar el correo electrónico con la imagen en base64
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODE_MAILER_USER,
      pass: process.env.NODE_MAILER_PASS,
    },
  });

  const mailOptions = {
    from: `Informe detección de acné 👋"<${process.env.NODE_MAILER_USER}>`,
    to: email,
    subject: "Resultado de Detección de Acné",
    html: `
      <p>El tratamiento recomendado es: ${tratamiento}</p>
      <img src="data:image/jpeg;base64,${base64Image}" alt="Detección de Acné"/>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email enviado con éxito");
  } catch (error) {
    console.error("Error al enviar el email:", error);
  }

  return new NextResponse(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}
