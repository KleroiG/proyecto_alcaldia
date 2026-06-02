"use client"

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react"

import { Trash2, Save } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type ConfirmationVariant = "danger" | "warning"

interface ConfirmationOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: ConfirmationVariant
}

interface ConfirmationContextType {
  confirm: (options: ConfirmationOptions) => Promise<boolean>
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(
  undefined
)

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext)

  if (!context) {
    throw new Error(
      "useConfirmation debe utilizarse dentro de ConfirmationProvider"
    )
  }

  return context
}

export const ConfirmationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const [options, setOptions] = useState<ConfirmationOptions | null>(null)

  const [resolver, setResolver] =
    useState<(value: boolean) => void>()

  const confirm = useCallback(
    (options: ConfirmationOptions) => {
      setOptions(options)
      setIsOpen(true)

      return new Promise<boolean>((resolve) => {
        setResolver(() => resolve)
      })
    },
    []
  )

  const handleConfirm = () => {
    resolver?.(true)
    setIsOpen(false)
  }

  const handleCancel = () => {
    resolver?.(false)
    setIsOpen(false)
  }

  const isDanger = options?.variant === "danger"

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}

      {isOpen && options && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCancel}

          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200 border border-white/50 shadow-[0_25px_80px_rgba(0,0,0,0.25)]">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
            ></motion.div>
            <div
              className={`
                relative overflow-hidden px-6 py-5
                ${isDanger
                  ? "bg-gradient-to-r from-red-50 via-red-50 to-red-100"
                  : "bg-gradient-to-r from-amber-50 via-amber-50 to-yellow-100"}
              `}
            >
              <div
                className={`
                absolute top-0 left-0 w-full h-1
                ${isDanger
                    ? "bg-red-500"
                    : "bg-[#d4a84b]"}
                `}
              />

              <div className="flex items-center gap-4">
                <div
                  className={`
                  relative flex items-center justify-center
                  w-16 h-16 rounded-full
                  ${isDanger
                      ? "bg-red-100"
                      : "bg-amber-100"}
                  `}
                >
                  <div
                    className={`
                    absolute inset-0 rounded-full blur-xl opacity-40
                    ${isDanger
                        ? "bg-red-400"
                        : "bg-amber-400"}
                    `}
                  />

                  {isDanger ? (
                    <Trash2 className="relative w-8 h-8 text-red-600" />
                  ) : (
                    <Save className="relative w-8 h-8 text-amber-600" />
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {options.title}
                  </h2>

                  <p className="text-sm text-gray-600 mt-1">
                    {options.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                {options.cancelText || "Cancelar"}
              </button>

              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded-lg text-white transition ${isDanger
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-[#10b981] hover:bg-[#059669]"
                  }`}
              >
                {options.confirmText || "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmationContext.Provider>
  )
}