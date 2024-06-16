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
  const average_confidence = Math.floor(Number(result.average_confidence));
  console.log(average_confidence);

  // Determinar el tipo de tratamiento basado en el promedio de confianza
  let tratamiento = "";
  let causas = "";
  let referencias = `
    <p>Para más información, puedes consultar las siguientes referencias:</p>
    <ul>
      <li><a style="text-decoration: underline;" href="https://www.aad.org/public/diseases/acne" target="_blank">American Academy of Dermatology - Acne</a></li>
      <li><a style="text-decoration: underline;" href="https://www.mayoclinic.org/diseases-conditions/acne/diagnosis-treatment/drc-20368047" target="_blank">Mayo Clinic - Acne: Diagnosis and Treatment</a></li>
      <li><a style="text-decoration: underline;" href="https://www.nhs.uk/conditions/acne/treatment/" target="_blank">NHS - Acne Treatment</a></li>
    </ul>
  `;

  if (average_confidence < 20) {
    console.log(average_confidence);
    tratamiento = `
      <h3 style="padding-bottom: 0.5rem;">Grado de Acné: Leve</h3>
      <p>Recomendaciones:</p>
      <ul style="display: flex; flex-direction: column; gap: 1rem;">
        <li>Usar productos tópicos que contengan peróxido de benzoilo o ácido salicílico.</li>
        <li>Lavar el rostro dos veces al día con un limpiador suave.</li>
        <li>Evitar productos grasosos y no comedogénicos.</li>
      </ul>
    `;
    causas = `
      <h3 style="padding-top: 0.5rem;">Posibles Causas:</h3>
      <p>El acné leve generalmente se debe a la obstrucción de los poros por sebo y células muertas de la piel. Otros factores incluyen:</p>
      <ul style="display: flex; flex-direction: column; gap: 1rem;">
        <li>Hormonas durante la pubertad o el ciclo menstrual.</li>
        <li>Uso de productos para el cuidado de la piel que son grasosos o irritantes.</li>
        <li>Estrés y dieta.</li>
      </ul>
    `;
  } else if (average_confidence >= 20 && average_confidence < 70) {
    console.log(average_confidence);
    tratamiento = `
      <h3 style="padding-bottom: 0.5rem;">Grado de Acné: Moderado</h3>
      <p>Recomendaciones:</p>
      <ul style="display: flex; flex-direction: column; gap: 1rem;">
        <li>Usar retinoides tópicos combinados con peróxido de benzoilo y antibióticos tópicos.</li>
        <li>En algunos casos, considerar antibióticos orales para reducir la inflamación.</li>
        <li>Seguir una rutina de limpieza suave y evitar tocar las áreas afectadas.</li>
      </ul>
    `;
    causas = `
      <h3 style="padding-top: 0.5rem;">Posibles Causas:</h3>
      <p>El acné moderado puede ser causado por:</p>
      <ul style="display: flex; flex-direction: column; gap: 1rem;">
        <li>Desequilibrio hormonal.</li>
        <li>Genética.</li>
        <li>Acumulación de bacterias en la piel.</li>
      </ul>
    `;
  } else if (average_confidence >= 70) {
    console.log(average_confidence);
    tratamiento = `
      <h3 style="padding-bottom: 0.5rem;">Grado de Acné: Severo</h3>
      <p>Recomendaciones:</p>
      <ul style="display: flex; flex-direction: column; gap: 1rem;">
        <li>Considerar el uso de isotretinoína oral bajo supervisión médica.</li>
        <li>Terapias adicionales como inyecciones de esteroides y tratamientos con luz o láser pueden ser útiles.</li>
        <li>Seguir de cerca las indicaciones del dermatólogo debido a los posibles efectos secundarios graves.</li>
      </ul>
    `;
    causas = `
      <h3 style="padding-top: 0.5rem;">Posibles Causas:</h3>
      <p>El acné severo puede estar asociado con:</p>
      <ul style="display: flex; flex-direction: column; gap: 1rem;">
        <li>Desequilibrios hormonales significativos.</li>
        <li>Genética y antecedentes familiares de acné severo.</li>
        <li>Factores ambientales y uso de ciertos medicamentos.</li>
      </ul>
    `;
  }

  // Contenido completo del correo electrónico
  const emailContent = `
    <img src="data:image/jpeg;base64,${result.image}" alt="Detección de Acné"/>
    <p>${tratamiento}</p>
    <p>${causas}</p>
    ${referencias}
  `;

  // Contenido HTML sin la imagen para la respuesta
  const htmlContentWithoutImage = `
    <p>${tratamiento}</p>
    <p>${causas}</p>
    ${referencias}
  `;

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
    html: emailContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email enviado con éxito");
  } catch (error) {
    console.error("Error al enviar el email:", error);
  }

  return new NextResponse(
    JSON.stringify({ imagen: result, html: htmlContentWithoutImage }),
    {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    }
  );
}
