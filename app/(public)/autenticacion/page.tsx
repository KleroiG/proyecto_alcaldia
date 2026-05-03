"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Mail, Lock, User, Sun, ArrowRight, AlertCircle, Phone, Calendar, Hash, CheckSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Autenticacion() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  // Estados compartidos
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Estados específicos para Registro
  const [id_perfil, setIdPerfil] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fecha_nacimiento, setFechaNacimiento] = useState("");
  const [genero, setGenero] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipo_identificacion, setTipoIdentificacion] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const API_URL = "http://localhost:3000/api";

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccessMsg("");
    // Limpiar campos de contraseña al cambiar de modo
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      if (isLogin) {
        // --- LÓGICA DE LOGIN ---
        const loginData = { correo, password };

        const response = await fetch(`${API_URL}/login/auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al iniciar sesión');
        }

        setSuccessMsg("¡Inicio de sesión exitoso!");
        localStorage.setItem('token', data.token);
        
        // Redirección
        router.push('/vista_admin'); 

      } else {
        // --- LÓGICA DE REGISTRO CON VALIDACIONES ---
        
        // 1. Validar Nombre y Apellido (Solo letras, espacios y tildes)
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!nameRegex.test(nombre) || !nameRegex.test(apellido)) {
          throw new Error("El nombre y el apellido solo pueden contener letras.");
        }

        // 2. Validar Fecha de Nacimiento (Mayor de 18 años)
        const birthDate = new Date(fecha_nacimiento);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        // Restamos 1 año si aún no ha cumplido en el mes o día actual del año en curso
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18) {
          throw new Error("Debes ser mayor de 18 años para registrarte.");
        }

        // 3. Validar Teléfono (Solo números, entre 7 y 15 dígitos)
        const phoneRegex = /^\d{7,15}$/;
        if (!phoneRegex.test(telefono)) {
          throw new Error("El teléfono debe contener solo números (mínimo 7).");
        }

        // 4. Validar Correo Electrónico (Formato estandar con @ y dominio)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(correo)) {
          throw new Error("Ingresa un correo electrónico válido (ej. usuario@correo.com).");
        }

        // 5. Validar Contraseña Segura (Mínimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 número)
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!passwordRegex.test(password)) {
          throw new Error("La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula y un número.");
        }

        // 6. Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
          throw new Error("Las contraseñas no coinciden. Por favor, verifica.");
        }

        // Si pasa todas las validaciones, construimos el objeto
        const registerData = {
          id_perfil: Number(id_perfil),
          nombre,
          apellido,
          correo,
          fecha_nacimiento,
          genero,
          telefono,
          tipo_identificacion,
          password
        };

        const response = await fetch(`${API_URL}/profiles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registerData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al registrar el usuario');
        }

        setSuccessMsg("Usuario registrado exitosamente. Por favor, inicia sesión.");
        
        setTimeout(() => {
          setIsLogin(true);
          setPassword("");
          setSuccessMsg("");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants: Variants = {
    hidden: { opacity: 0, x: isLogin ? -20 : 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: isLogin ? 20 : -20, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-[110vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#00A859] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#7B1B1B] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      {/* Se ajusta el ancho máximo si es registro para acomodar más campos */}
      <div className={`${isLogin ? 'max-w-md' : 'max-w-2xl'} w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl z-10 relative border border-gray-100 transition-all duration-300`}>

        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mx-auto h-16 w-16 bg-[#7B1B1B] bg-opacity-10 rounded-full flex items-center justify-center mb-4"
          >
            <Sun className="h-8 w-8 text-[#D9A05B]" />
          </motion.div>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight">
            {isLogin ? "Bienvenido de vuelta" : "Únete a nosotros"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "¿No tienes una cuenta? " : "¿Ya eres parte de Sogamoso? "}
            <button
              onClick={toggleAuthMode}
              type="button"
              className="font-medium text-[#00A859] hover:text-[#008f4c] transition-colors focus:outline-none focus:underline"
            >
              {isLogin ? "Regístrate aquí" : "Inicia sesión"}
            </button>
          </p>
        </div>

        <div className="mt-8">
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
              {/* Mensajes de Estado */}
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border-l-4 border-red-500 p-3 flex items-center gap-2 text-red-700 text-sm rounded">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </motion.div>
              )}
              {successMsg && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border-l-4 border-[#00A859] p-3 flex items-center gap-2 text-green-700 text-sm rounded">
                  <CheckSquare className="h-4 w-4" />
                  {successMsg}
                </motion.div>
              )}

              {/* Contenedor de grilla para Registro */}
              <div className={!isLogin ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>

                {/* Campos exclusivos de Registro */}
                {!isLogin && (
                  <>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Tipo Identificación</label>
                      <select required value={tipo_identificacion} onChange={(e) => setTipoIdentificacion(e.target.value)} className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#00A859] focus:border-[#00A859] sm:text-sm">
                        <option value="">Seleccione...</option>
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="PA">Pasaporte</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Número de Documento (ID Perfil)</label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Hash className="h-5 w-5" /></div>
                        <input type="number" required value={id_perfil} onChange={(e) => setIdPerfil(e.target.value)} className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#00A859] focus:border-[#00A859] sm:text-sm" placeholder="xxxxxxxxx" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Nombre</label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><User className="h-5 w-5" /></div>
                        <input
                          type="text"
                          required
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''))}
                          className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#00A859] focus:border-[#00A859] sm:text-sm"
                          placeholder="Juan"
                        />                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Apellido</label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><User className="h-5 w-5" /></div>
                        <input
                          type="text"
                          required
                          value={apellido}
                          onChange={(e) => setApellido(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''))}
                          className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#00A859] focus:border-[#00A859] sm:text-sm"
                          placeholder="Garcia"
                        />                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Calendar className="h-5 w-5" /></div>
                        <input
                          type="date"
                          required
                          value={fecha_nacimiento}
                          onChange={(e) => setFechaNacimiento(e.target.value)}
                          className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#00A859] focus:border-[#00A859] sm:text-sm"
                        />                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Género</label>
                      <select required value={genero} onChange={(e) => setGenero(e.target.value)} className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#00A859] focus:border-[#00A859] sm:text-sm">
                        <option value="">Seleccione...</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                        <option value="O">Otro</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Phone className="h-5 w-5" /></div>
                        <input
                          type="tel"
                          required
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          maxLength={15}
                          className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#00A859] focus:border-[#00A859] sm:text-sm"
                          placeholder="3xxxxxxxx"
                        />                      </div>
                    </div>
                  </>
                )}

                {/* Campos compartidos y contraseñas */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Mail className="h-5 w-5" /></div>
                    <input type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#00A859] focus:border-[#00A859] sm:text-sm" placeholder="xxxx@correo.com" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Lock className="h-5 w-5" /></div>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#00A859] focus:border-[#00A859] sm:text-sm" placeholder="••••••••" />
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Lock className="h-5 w-5" /></div>
                      <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`appearance-none block w-full pl-10 px-3 py-3 border rounded-lg shadow-sm focus:outline-none sm:text-sm ${confirmPassword && password !== confirmPassword ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300 focus:ring-[#00A859] focus:border-[#00A859]'}`} placeholder="••••••••" />
                    </div>
                  </div>
                )}
              </div>

              {/* Botón de Iniciar Sesión o Crear Cuenta */}
              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input id="rem" type="checkbox" className="h-4 w-4 text-[#00A859] border-gray-300 rounded cursor-pointer" />
                    <label htmlFor="rem" className="ml-2 block text-sm text-gray-900 cursor-pointer">Recordarme</label>
                  </div>
                  <a href="/vista_admin" className="text-sm font-medium text-[#7B1B1B] hover:underline">¿Olvidaste tu contraseña?</a>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00A859] hover:bg-[#008f4c]'}`}
              >
                {isLoading ? "Procesando..." : isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </motion.button>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}