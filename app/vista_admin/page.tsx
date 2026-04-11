"use client"

import { useState } from "react"
import { AdminSidebar } from "@/app/vista_admin/admin-sidebar"
import { AdminHeader } from "@/app/vista_admin/admin-header"
import { MobileSidebar } from "@/app/vista_admin/mobile-sidebar"
import { RoleManagement } from "@/app/vista_admin/role-management"

export default function AdminDashboard() {
  const [activeItem, setActiveItem] = useState("roles")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleLogout = () => {
    console.log("Logging out...")
  }

  const handleNavigate = (item: string) => {
    setActiveItem(item)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <AdminSidebar
          isSuperadmin={true}
          activeItem={activeItem}
          onNavigate={handleNavigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header with Mobile Menu */}
        <header className="flex h-16 items-center gap-2 border-b border-border bg-card px-4 lg:px-6">
          {/* Mobile Menu Trigger */}
          <MobileSidebar
            isSuperadmin={true}
            activeItem={activeItem}
            onNavigate={handleNavigate}
          />
          
          {/* Title */}
          <div className="flex items-center gap-2">
            <h1 className="text-base lg:text-lg font-semibold text-foreground truncate">
              <span className="lg:hidden">Roles</span>
              <span className="hidden lg:inline">Gestión de Roles</span>
            </h1>
          </div>
          
          <div className="ml-auto flex items-center">
            <AdminHeader
              userName="Carlos Rodríguez"
              userRole="Superadministrador"
              notificationCount={3}
              onLogout={handleLogout}
            />
          </div>
        </header>

        {/* Main Content - Role Management */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">
            <RoleManagement />
          </div>
        </main>
      </div>
    </div>
  )
}
