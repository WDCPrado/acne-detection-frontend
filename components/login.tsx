"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { persons } from "@/lib/constants";
import { formatedRut } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [rut, setRut] = useState("");

  function verifyPerson(rut: string) {
    const person = persons.find((p) => p.rut === rut);
    if (!person) {
      toast.error("No se encontró una persona con ese RUT");
      return -1;
    }

    if (person.patient) {
      toast.success("Autenticado como paciente");
      return 1;
    }

    if (person.professional) {
      toast.success("Autenticado como profesional");
      return 2;
    }

    toast.error("No se pudo autenticar");
    return -1;
  }

  const handleRutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputRut = event.target.value;
    const formatted = formatedRut(inputRut);
    setRut(formatted);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = verifyPerson(rut);
      if (result === 1 || result === 2) {
        return router.push("/admin");
      }
    } catch (error) {
      toast.error("Error al autenticar");
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Verificar Paciente</CardTitle>
        <CardDescription>Ingrese su RUT</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="rut">RUT</Label>
            <Input
              id="rut"
              name="rut"
              type="text"
              placeholder="25036..."
              required
              value={rut}
              maxLength={10}
              onChange={handleRutChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit">
            Autenticar
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
