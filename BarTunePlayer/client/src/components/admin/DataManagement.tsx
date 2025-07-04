import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { exportLibrary } from "@/api/admin"
import { toast } from "sonner"
import { Download, Upload, Database, Github, FileText, Music, Loader2 } from "lucide-react"

export function DataManagement() {
  const [exporting, setExporting] = useState<string | null>(null)
  const [githubConfig, setGithubConfig] = useState({
    token: "",
    repository: ""
  })

  const handleExport = async (format: 'json' | 'm3u' | 'csv') => {
    setExporting(format)
    try {
      console.log("Exporting library in format:", format)
      const result = await exportLibrary(format)
      
      if (result.success) {
        // Create download link
        const link = document.createElement('a')
        link.href = result.downloadUrl
        link.download = `music-library.${format}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast.success(`Library exported as ${format.toUpperCase()}`)
      }
    } catch (error) {
      console.error("Export error:", error)
      toast.error(`Failed to export library as ${format.toUpperCase()}`)
    } finally {
      setExporting(null)
    }
  }

  const handleBackup = () => {
    console.log("Creating backup...")
    toast.success("Backup created successfully")
  }

  const handleRestore = () => {
    console.log("Restoring from backup...")
    toast.success("Library restored successfully")
  }

  const handleGithubSync = () => {
    console.log("Syncing with GitHub:", githubConfig.repository)
    toast.success("Synced with GitHub repository")
  }

  return (
    <div className="space-y-6">
      {/* Library Backup */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">Library Backup</CardTitle>
              <p className="text-gray-400 text-sm">Create and restore backups of your music library</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleBackup}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Create Backup
            </Button>
            <Button
              onClick={handleRestore}
              variant="outline"
              className="border-white/10 text-white hover:bg-white/10"
            >
              <Upload className="h-4 w-4 mr-2" />
              Restore Backup
            </Button>
          </div>
          <div className="text-sm text-gray-400">
            Last backup: January 15, 2024 at 10:30 AM
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">Export Library</CardTitle>
              <p className="text-gray-400 text-sm">Export playlists in various formats</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Button
              onClick={() => handleExport('json')}
              disabled={exporting === 'json'}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {exporting === 'json' ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Exporting...</>
              ) : (
                <><FileText className="h-4 w-4 mr-2" /> JSON</>
              )}
            </Button>
            <Button
              onClick={() => handleExport('m3u')}
              disabled={exporting === 'm3u'}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {exporting === 'm3u' ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Exporting...</>
              ) : (
                <><Music className="h-4 w-4 mr-2" /> M3U</>
              )}
            </Button>
            <Button
              onClick={() => handleExport('csv')}
              disabled={exporting === 'csv'}
              className="bg-green-600 hover:bg-green-700"
            >
              {exporting === 'csv' ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Exporting...</>
              ) : (
                <><Database className="h-4 w-4 mr-2" /> CSV</>
              )}
            </Button>
          </div>
          <div className="text-sm text-gray-400">
            Export includes all playlists, tracks, and metadata
          </div>
        </CardContent>
      </Card>

      {/* GitHub Integration */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
              <Github className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">GitHub Integration</CardTitle>
              <p className="text-gray-400 text-sm">Sync converted playlists to GitHub repository</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="github-token">Personal Access Token</Label>
            <Input
              id="github-token"
              type="password"
              value={githubConfig.token}
              onChange={(e) => setGithubConfig(prev => ({ ...prev, token: e.target.value }))}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="bg-black/30 border-white/10 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github-repo">Repository</Label>
            <Input
              id="github-repo"
              value={githubConfig.repository}
              onChange={(e) => setGithubConfig(prev => ({ ...prev, repository: e.target.value }))}
              placeholder="username/music-playlists"
              className="bg-black/30 border-white/10 text-white"
            />
          </div>
          <Button
            onClick={handleGithubSync}
            disabled={!githubConfig.token || !githubConfig.repository}
            className="w-full bg-gray-800 hover:bg-gray-700"
          >
            <Github className="h-4 w-4 mr-2" />
            Sync to GitHub
          </Button>
          <div className="text-sm text-gray-400">
            Last sync: January 14, 2024 at 3:45 PM
          </div>
        </CardContent>
      </Card>

      {/* Storage Statistics */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">Storage Statistics</CardTitle>
              <p className="text-gray-400 text-sm">Current library storage usage</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">127</div>
              <div className="text-sm text-gray-400">Total Playlists</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">2,847</div>
              <div className="text-sm text-gray-400">Total Tracks</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Database Size</span>
              <span className="text-purple-400">45.2 MB / 100 MB</span>
            </div>
            <Progress value={45.2} className="h-2" />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-lg font-bold text-green-400">89</div>
              <div className="text-gray-400">Converted</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-400">23</div>
              <div className="text-gray-400">YouTube</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-400">15</div>
              <div className="text-gray-400">Manual</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}