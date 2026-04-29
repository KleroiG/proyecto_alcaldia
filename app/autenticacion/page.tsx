"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Mail, Lock, User, Sun, ArrowRight, AlertCircle } from "lucide-react";

export default function autenticacion() {
  const [isLogin, setIsLogin] = useState(true);
  
  // Estados para manejar los valores y errores de validación
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(""); // Limpiar errores al cambiar de modo
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validación específica para el registro
    if (!isLogin && password !== confirmPassword) {
      setError("Las contraseñas no coinciden. Por favor, verifica.");
      return;
    }

    // Aquí iría tu lógica de conexión con el backend (Firebase, Supabase, API propia)
    console.log("Formulario enviado con éxito");
  };

  const formVariants: Variants = {
    hidden: { opacity: 0, x: isLogin ? -20 : 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: isLogin ? 20 : -20, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-[110vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decoración de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#00A859] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#7B1B1B] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl z-10 relative border border-gray-100">
        
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
              {/* Mensaje de Error Visual */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border-l-4 border-red-500 p-3 flex items-center gap-2 text-red-700 text-sm rounded"
                >
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </motion.div>
              )}

              {!isLogin && (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      required
                      className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#00A859] focus:border-[#00A859] sm:text-sm transition-all"
                      placeholder="Juan Pérez"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    required
                    className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#00A859] focus:border-[#00A859] sm:text-sm transition-all"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#00A859] focus:border-[#00A859] sm:text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* NUEVO CAMPO: Confirmar Contraseña */}
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-1"
                >
                  <label className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`appearance-none block w-full pl-10 px-3 py-3 border rounded-lg shadow-sm focus:outline-none sm:text-sm transition-all ${
                        confirmPassword && password !== confirmPassword 
                        ? 'border-red-400 ring-1 ring-red-400' 
                        : 'border-gray-300 focus:ring-[#00A859] focus:border-[#00A859]'
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                </motion.div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input id="rem" type="checkbox" className="h-4 w-4 text-[#00A859] border-gray-300 rounded cursor-pointer" />
                    <label htmlFor="rem" className="ml-2 block text-sm text-gray-900 cursor-pointer">Recordarme</label>
                  </div>
                  <a href="#" className="text-sm font-medium text-[#7B1B1B] hover:underline">¿Olvidaste tu contraseña?</a>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full flex justify-center items-center py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#00A859] hover:bg-[#008f4c] transition-all"
              >
                {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.button>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}