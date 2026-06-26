"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { AlertCircle, ArrowRight, Calendar, CheckSquare, Hash, Lock, Mail, Phone, Sun, User, } from "lucide-react";
import { useRouter } from "next/navigation";
import { canAccessAdmin, clearSession, login, registerProfile } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

export default function Autenticacion() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [idPerfil, setIdPerfil] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [genero, setGenero] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipoIdentificacion, setTipoIdentificacion] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toggleAuthMode = () => {
    setIsLogin((current) => !current);
    setError("");
    setSuccessMsg("");
    setPassword("");
    setConfirmPassword("");
  };

  const validateRegister = () => {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(nombre) || !nameRegex.test(apellido)) {
      throw new Error("El nombre y el apellido solo pueden contener letras.");
    }

    const birthDate = new Date(fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (Number.isNaN(birthDate.getTime()) || age < 18) {
      throw new Error("Debes ser mayor de 18 anos para registrarte.");
    }

    if (!/^\d{7,15}$/.test(telefono)) {
      throw new Error("El telefono debe contener solo numeros y tener minimo 7 digitos.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(correo)) {
      throw new Error("Ingresa un correo electronico valido.");
    }

    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)) {
      throw new Error(
        "La contrasena debe tener minimo 8 caracteres, una mayuscula, una minuscula y un numero.",
      );
    }

    if (password !== confirmPassword) {
      throw new Error("Las contrasenas no coinciden.");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      if (isLogin) {
        const session = await login({ correo, password });

        if (!canAccessAdmin(session.profile)) {
          clearSession();
          throw new Error("Solo administradores y super administradores pueden iniciar sesion.");
        }

        setSuccessMsg("Inicio de sesion exitoso.");
        router.push(ROUTES.admin);
        return;
      }

      validateRegister();

      await registerProfile({
        id_perfil: idPerfil,
        nombre,
        apellido,
        correo,
        fecha_nacimiento: fechaNacimiento,
        genero,
        telefono,
        tipo_identificacion: tipoIdentificacion,
        password,
      });

      setSuccessMsg("Usuario registrado exitosamente. Ahora puedes iniciar sesion.");
      setIsLogin(true);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrio un error inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants: Variants = {
    hidden: { opacity: 0, x: isLogin ? -20 : 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
    exit: { opacity: 0, x: isLogin ? 20 : -20, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-[110vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#00A859] rounded-full mix-blend-multiply blur-3xl opacity-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#7B1B1B] rounded-full mix-blend-multiply blur-3xl opacity-10" />

      <div className={`${isLogin ? "max-w-md" : "max-w-2xl"} w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl z-10 relative border border-gray-100 transition-all duration-300`}>
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mx-auto h-16 w-16 bg-[#7B1B1B]/10 rounded-full flex items-center justify-center mb-4"
          >
            <Sun className="h-8 w-8 text-[#D9A05B]" />
          </motion.div>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight">
            {isLogin ? "Bienvenido de vuelta" : "Crea tu cuenta"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Acceso exclusivo para administradores" : "Ya tienes cuenta? "}
            <button
              onClick={toggleAuthMode}
              type="button"
              className={`${isLogin ? "hidden" : "inline"} font-medium text-[#00A859] hover:text-[#008f4c] transition-colors focus:outline-none focus:underline`}
            >
              Inicia sesion
            </button>
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? "login" : "register"}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-5"
            onSubmit={handleSubmit}
          >
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border-l-4 border-red-500 p-3 flex items-center gap-2 text-red-700 text-sm rounded">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}

            {successMsg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border-l-4 border-[#00A859] p-3 flex items-center gap-2 text-green-700 text-sm rounded">
                <CheckSquare className="h-4 w-4 shrink-0" />
                {successMsg}
              </motion.div>
            )}

            <div className={!isLogin ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
              {!isLogin && (
                <>
                  <Field label="Tipo Identificacion">
                    <select required value={tipoIdentificacion} onChange={(e) => setTipoIdentificacion(e.target.value)} className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#00A859] focus:border-[#00A859] sm:text-sm">
                      <option value="">Seleccione...</option>
                      <option value="CC">Cedula de Ciudadania</option>
                      <option value="CE">Cedula de Extranjeria</option>
                      <option value="PA">Pasaporte</option>
                    </select>
                  </Field>

                  <Field label="Numero de Documento">
                    <InputWithIcon icon={<Hash className="h-5 w-5" />}>
                      <input type="number" required value={idPerfil} onChange={(e) => setIdPerfil(e.target.value)} className={inputClassName} placeholder="1002558634" />
                    </InputWithIcon>
                  </Field>

                  <Field label="Nombre">
                    <InputWithIcon icon={<User className="h-5 w-5" />}>
                      <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClassName} placeholder="Peter" />
                    </InputWithIcon>
                  </Field>

                  <Field label="Apellido">
                    <InputWithIcon icon={<User className="h-5 w-5" />}>
                      <input type="text" required value={apellido} onChange={(e) => setApellido(e.target.value)} className={inputClassName} placeholder="Admin" />
                    </InputWithIcon>
                  </Field>

                  <Field label="Fecha de Nacimiento">
                    <InputWithIcon icon={<Calendar className="h-5 w-5" />}>
                      <input type="date" required value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} className={inputClassName} />
                    </InputWithIcon>
                  </Field>

                  <Field label="Genero">
                    <select required value={genero} onChange={(e) => setGenero(e.target.value)} className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#00A859] focus:border-[#00A859] sm:text-sm">
                      <option value="">Seleccione...</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                      <option value="O">Otro</option>
                    </select>
                  </Field>

                  <Field label="Telefono">
                    <InputWithIcon icon={<Phone className="h-5 w-5" />}>
                      <input type="tel" required value={telefono} onChange={(e) => setTelefono(e.target.value.replace(/\D/g, "").slice(0, 15))} className={inputClassName} placeholder="3162765898" />
                    </InputWithIcon>
                  </Field>
                </>
              )}

              <Field label="Correo electronico">
                <InputWithIcon icon={<Mail className="h-5 w-5" />}>
                  <input type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} className={inputClassName} placeholder="usuario@correo.com" />
                </InputWithIcon>
              </Field>

              <Field label="Contrasena">
                <InputWithIcon icon={<Lock className="h-5 w-5" />}>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClassName} placeholder="********" />
                </InputWithIcon>
              </Field>

              {!isLogin && (
                <Field label="Confirmar contrasena">
                  <InputWithIcon icon={<Lock className="h-5 w-5" />}>
                    <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`${inputClassName} ${confirmPassword && password !== confirmPassword ? "border-red-400 ring-1 ring-red-400" : ""}`} placeholder="********" />
                  </InputWithIcon>
                </Field>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#00A859] hover:bg-[#008f4c]"}`}
            >
              {isLoading ? "Procesando..." : isLogin ? "Iniciar sesion" : "Crear cuenta"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </motion.button>
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
}

const inputClassName =
  "appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#00A859] focus:border-[#00A859] sm:text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function InputWithIcon({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative mt-1">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>
      {children}
    </div>
  );
}
