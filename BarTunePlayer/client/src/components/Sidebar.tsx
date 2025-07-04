import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { 
  Home, 
  Settings, 
  Music, 
  PlayCircle, 
  List, 
  Search,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "./ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  const handleLogout = () => {
    console.log("User logging out")
    logout()
    navigate("/login")
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Settings, label: "Admin Panel", path: "/admin" },
  ]

  return (
    <div className={cn(
      "h-screen bg-black/20 backdrop-blur-xl border-r border-white/10 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <Music className="h-8 w-8 text-purple-400" />
                <span className="text-xl font-bold text-white">MusicPlayer</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="text-white hover:bg-white/10"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-white hover:bg-white/10",
                    collapsed && "px-2",
                    isActive && "bg-purple-600/20 text-purple-300"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="h-5 w-5" />
                  {!collapsed && <span className="ml-2">{item.label}</span>}
                </Button>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-white hover:bg-red-500/20 hover:text-red-300",
              collapsed && "px-2"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}