// app/(admin)/vista_admin/components/AdminLayoutShell.tsx
"use client"

import { useState } from "react"
import { AdminSidebar } from "../(admin)/vista_admin/admin-sidebar"
import { AdminHeader } from "../(admin)/vista_admin/admin-header"
import { MobileSidebar } from "../(admin)/vista_admin/mobile-sidebar"
import { RoleManagement } from "./vista_admin/gestor_roles/role-management"
import { EventosAdmin } from "./vista_admin/eventos/eventos"
import { GraficasAdmin } from "./vista_admin/estadisticas/graficas"
import AdminTourismPage from "./vista_admin/atracciones/controlador"
import AdminPrestadoresPage from "./vista_admin/prestadores_servicios/page"


export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
    const [activeItem, setActiveItem] = useState("roles")
    const [collapsed, setCollapsed] = useState(false)

    // Mapeo de secciones para escalabilidad
    const renderContent = () => {
        switch (activeItem) {
            case "attractions":
                return <AdminTourismPage />;
            case "prestadores":
                return <AdminPrestadoresPage />;
            case "roles":
                return <RoleManagement />;
            case "events":
                return <EventosAdmin />;
            case "dashboard":
                return <GraficasAdmin />;
            default:
                return <div className="p-4">Sección en desarrollo...</div>;
        }
    }

    return (
        <div className="flex min-h-screen bg-background">
            <div className="hidden lg:block">
                <AdminSidebar
                    activeItem={activeItem}
                    onNavigate={(item) => setActiveItem(item)} // Actualiza el estado al hacer click
                    collapsed={collapsed}
                    onToggleCollapse={() => setCollapsed(!collapsed)}
                />
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 items-center gap-2 border-b border-border bg-card px-4 lg:px-6">
                    <MobileSidebar
                        activeItem={activeItem}
                        onNavigate={setActiveItem}
                    />
                    <h1 className="text-lg font-semibold">Panel Administrativo</h1>
                    <div className="ml-auto">
                        <AdminHeader userName="Carlos Rodríguez" userRole="Superadministrador" />
                    </div>
                </header>


                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* ... Header ... */}
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
                        <div className="mx-auto max-w-7xl">
                            {/* Renderizamos el componente dinámico en lugar de children si es navegación interna */}
                            {renderContent()}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}