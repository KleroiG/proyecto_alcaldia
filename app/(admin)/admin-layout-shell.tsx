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
import { PerfilDialog } from "./vista_admin/perfil-dialog"
import { AuthProfile, canAccessAdmin, canManageUsers, clearSession, getAllowedAdminSections, getInitialAdminSection, getProfileName, getProfileRole, getStoredProfile, getStoredToken } from "@/lib/auth"
import { gdriveUrl } from "@/lib/events"
import { ROUTES } from "@/lib/routes"


export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
    const [activeItem, setActiveItem] = useState("roles")
    const [collapsed, setCollapsed] = useState(false)
    const [profile, setProfile] = useState<AuthProfile | null>(null)
    const [isCheckingSession, setIsCheckingSession] = useState(true)
    const [perfilOpen, setPerfilOpen] = useState(false)
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
            case "sin-permisos":
                return <SinPermisos />
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
                            avatarUrl={gdriveUrl(String(profile?.url_foto ?? profile?.avatar ?? ""))}
                            onLogout={handleLogout}
                            onProfileClick={() => setPerfilOpen(true)}
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

                <PerfilDialog
                    open={perfilOpen}
                    onOpenChange={setPerfilOpen}
                    profile={profile}
                    onProfileUpdate={(updated) => setProfile(updated)}
                />
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

function SinPermisos() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="mx-auto max-w-md text-center space-y-6">
                <div className="flex justify-center">
                    <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
                        <svg className="size-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-bold text-foreground">
                        Sin permisos asignados
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Tu cuenta aún no tiene acceso a ningún módulo del sistema.
                        Comunícate con un superadministrador para que te asigne los permisos correspondientes.
                    </p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 px-6 py-4 text-sm text-muted-foreground">
                    Contacta al administrador del sistema y solicita que habilite los módulos que necesitas desde la sección{" "}
                    <span className="font-semibold text-foreground">Gestión de Roles</span>.
                </div>
            </div>
        </div>
    )
}
