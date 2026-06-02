"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "./vista_admin/admin-sidebar"
import { AdminHeader } from "./vista_admin/admin-header"
import { MobileSidebar } from "./vista_admin/mobile-sidebar"
import { RoleManagement } from "./vista_admin/gestor_roles/role-management"
import { EventosAdmin } from "./vista_admin/eventos/eventos"
import { GraficasAdmin } from "./vista_admin/estadisticas/graficas"
import AdminTourismPage from "./vista_admin/atracciones/controlador"
import AdminPrestadoresPage from "./vista_admin/prestadores_servicios/page"
import { AuthProfile, canAccessAdmin, canManageUsers, clearSession, getAllowedAdminSections, getInitialAdminSection, getProfileName, getProfileRole, getStoredProfile, getStoredToken } from "@/lib/auth"
import { ROUTES } from "@/lib/routes"


export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
    const [activeItem, setActiveItem] = useState("roles")
    const [collapsed, setCollapsed] = useState(false)
    const [profile, setProfile] = useState<AuthProfile | null>(null)
    const [isCheckingSession, setIsCheckingSession] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const token = getStoredToken()

        if (!token) {
            router.replace(ROUTES.autenticacion)
            return
        }

        const storedProfile = getStoredProfile()

        if (!canAccessAdmin(storedProfile)) {
            clearSession()
            router.replace(ROUTES.autenticacion)
            return
        }

        setProfile(storedProfile)
        setActiveItem(getInitialAdminSection(storedProfile))
        setIsCheckingSession(false)
    }, [router])

    const allowedSections = getAllowedAdminSections(profile)
    const canOpenUserManagement = canManageUsers(profile)

    const handleNavigate = (item: string) => {
        if (!allowedSections.includes(item)) {
            return
        }

        setActiveItem(item)
    }

    const handleLogout = () => {
        clearSession()
        router.replace(ROUTES.autenticacion)
    }

    const renderContent = () => {
        switch (activeItem) {
            case "attractions":
                return <AdminTourismPage />;
            case "providers":
                return <AdminPrestadoresPage />;
            case "roles":
                return canOpenUserManagement ? <RoleManagement /> : <AccessDenied />
            case "events":
                return <EventosAdmin />
            case "dashboard":
                return <GraficasAdmin />
            default:
                return children || <div className="p-4">Seccion en desarrollo...</div>
        }
    }

    if (isCheckingSession) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-muted-foreground">
                Validando sesion...
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-background">
            <div className="hidden lg:block">
                <AdminSidebar
                    isSuperadmin={canOpenUserManagement}
                    allowedItems={allowedSections}
                    activeItem={activeItem}
                    onNavigate={handleNavigate}
                    collapsed={collapsed}
                    onToggleCollapse={() => setCollapsed(!collapsed)}
                />
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 items-center gap-2 border-b border-border bg-card px-4 lg:px-6">
                    <MobileSidebar
                        isSuperadmin={canOpenUserManagement}
                        allowedItems={allowedSections}
                        activeItem={activeItem}
                        onNavigate={handleNavigate}
                    />
                    <h1 className="text-lg font-semibold">Panel Administrativo</h1>
                    <div className="ml-auto">
                        <AdminHeader
                            userName={getProfileName(profile)}
                            userRole={getProfileRole(profile)}
                            onLogout={handleLogout}
                        />
                    </div>
                </header>

                <div className="flex flex-1 flex-col overflow-hidden">
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
                        <div className="mx-auto max-w-7xl">
                            {renderContent()}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

function AccessDenied() {
    return (
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
            No tienes permisos para acceder a esta seccion.
        </div>
    )
}
