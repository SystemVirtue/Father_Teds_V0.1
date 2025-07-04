import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiConfiguration } from "@/components/admin/ApiConfiguration"
import { SystemSettings } from "@/components/admin/SystemSettings"
import { DataManagement } from "@/components/admin/DataManagement"
import { ConversionHistory } from "@/components/admin/ConversionHistory"
import { getSystemSettings, getApiStatus } from "@/api/admin"
import { toast } from "sonner"

export function AdminPanel() {
  const [settings, setSettings] = useState(null)
  const [apiStatus, setApiStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      console.log("Loading admin panel data...")
      const [settingsData, statusData] = await Promise.all([
        getSystemSettings(),
        getApiStatus()
      ])
      
      setSettings(settingsData.settings)
      setApiStatus(statusData.status)
      console.log("Admin data loaded successfully")
    } catch (error) {
      console.error("Error loading admin data:", error)
      toast.error("Failed to load admin settings")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl">Loading admin panel...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-gray-300">Manage system settings, API configurations, and data</p>
      </div>

      <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <Tabs defaultValue="api" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/30">
            <TabsTrigger value="api" className="text-white data-[state=active]:bg-purple-600">
              API Config
            </TabsTrigger>
            <TabsTrigger value="system" className="text-white data-[state=active]:bg-purple-600">
              System
            </TabsTrigger>
            <TabsTrigger value="data" className="text-white data-[state=active]:bg-purple-600">
              Data
            </TabsTrigger>
            <TabsTrigger value="history" className="text-white data-[state=active]:bg-purple-600">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api">
            <ApiConfiguration 
              apiStatus={apiStatus}
              onStatusUpdate={setApiStatus}
            />
          </TabsContent>

          <TabsContent value="system">
            <SystemSettings 
              settings={settings}
              onSettingsUpdate={setSettings}
            />
          </TabsContent>

          <TabsContent value="data">
            <DataManagement />
          </TabsContent>

          <TabsContent value="history">
            <ConversionHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}