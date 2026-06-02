"use client"

import React, { useState, useEffect } from "react"
import { FaWhatsapp, FaTelegramPlane, FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa"

interface ShareModalProps {
    isOpen: boolean
    onClose: () => void
    shareUrl?: string
    title?: string
}

export default function ShareModal({
    isOpen,
    onClose,
    shareUrl = "",
    title = "Compartir",
}: ShareModalProps) {
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!isOpen) setCopied(false)
    }, [isOpen])

    if (!isOpen) return null

    const handleCopy = async () => {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(shareUrl)
            } else {
                // fallback clásico
                const textArea = document.createElement("textarea")
                textArea.value = shareUrl
                document.body.appendChild(textArea)
                textArea.select()
                document.execCommand("copy")
                document.body.removeChild(textArea)
            }

            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Error al copiar:", err)
        }
    }

    const socialShares = [
        {
            name: "Facebook",
            color: "bg-[#1877F2]",
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                shareUrl
            )}`,
            icon: (
                <div>
                    <FaFacebook className="w-6 h-6 text-white" />
                </div>
            ),
        },
        {
            name: "X",
            color: "bg-black",
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                shareUrl
            )}`,
            icon: (
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z" />
                </svg>
            ),
        },
        {
            name: "WhatsApp",
            color: "bg-[#25D366]",
            url: `https://api.whatsapp.com/send?text=${encodeURIComponent(
                shareUrl
            )}`,
            icon: (
                <div>
                    <FaWhatsapp className="w-6 h-6 text-white" />
                </div>
            ),
        },
        {
            name: "Telegram",
            color: "bg-[#24A1DE]",
            url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`,
            icon: (
                <div>
                    <FaTelegramPlane className="w-6 h-6 text-white" />
                </div>
            ),
        },
        {
            name: "LinkedIn",
            color: "bg-[#0077B5]",
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                shareUrl
            )}`,
            icon: (
                <div>
                    <FaLinkedin className="w-6 h-6 text-white" />
                </div>
            ),
        },
    ]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">

            {/* MODAL */}
            <div className="relative w-full max-w-md bg-white rounded-[28px] p-8 shadow-2xl animate-in fade-in zoom-in-95">

                {/* CLOSE */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
                >
                    ✕
                </button>

                {/* HEADER */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Comparte este contenido con tus amigos
                    </p>
                </div>

                {/* COPY LINK */}
                <div className="mb-6">
                    <div className="flex items-center bg-gray-100 rounded-xl p-3 gap-2">
                        <input
                            value={shareUrl}
                            readOnly
                            className="flex-1 bg-transparent text-sm outline-none"
                        />

                        <button
                            onClick={handleCopy}
                            className={`px-3 py-1 text-xs rounded-lg transition ${copied
                                ? "bg-green-500 text-white"
                                : "bg-white border hover:bg-gray-50"
                                }`}
                        >
                            {copied ? "Copiado" : "Copiar"}
                        </button>
                    </div>
                </div>

                {/* SOCIALS */}
                <div className="grid grid-cols-5 gap-3">
                    {socialShares.map((s, i) => (
                        <a
                            key={i}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-2"
                        >
                            <div
                                className={`w-11 h-11 rounded-full flex items-center justify-center text-white ${s.color} hover:scale-110 transition`}
                            >
                                {s.icon}
                            </div>
                            <span className="text-[11px] text-gray-500">{s.name}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}