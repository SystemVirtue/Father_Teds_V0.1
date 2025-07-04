import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { updateApiConfig, testApiConnection } from "@/api/admin"
import { toast } from "sonner"
import { CheckCircle, XCircle, Loader2, Music, Play } from "lucide-react"

interface ApiConfigurationProps {
  apiStatus: any
  onStatusUpdate: (status: any) => void
}

export function ApiConfiguration({ apiStatus, onStatusUpdate }: ApiConfigurationProps) {
  const [spotifyConfig, setSpotifyConfig] = useState({
    clientId: apiStatus?.spotify?.clientId || "",
    clientSecret: ""
  })
  const [youtubeConfig, setYoutubeConfig] = useState({
    apiKey: apiStatus?.youtube?.apiKey || ""
  })
  const [testing, setTesting] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)

  const handleSaveSpotify = async () => {
    setSaving('spotify')
    try {
      console.log("Saving Spotify configuration")
      await updateApiConfig('spotify', spotifyConfig)
      toast.success("Spotify configuration saved")
    } catch (error) {
      console.error("Error saving Spotify config:", error)
      toast.error("Failed to save Spotify configuration")
    } finally {
      setSaving(null)
    }
  }

  const handleSaveYoutube = async () => {
    setSaving('youtube')
    try {
      console.log("Saving YouTube configuration")
      await updateApiConfig('youtube', youtubeConfig)
      toast.success("YouTube configuration saved")
    } catch (error) {
      console.error("Error saving YouTube config:", error)
      toast.error("Failed to save YouTube configuration")
    } finally {
      setSaving(null)
    }
  }

  const handleTestConnection = async (service: 'spotify' | 'youtube') => {
    setTesting(service)
    try {
      console.log("Testing", service, "connection")
      const result = await testApiConnection(service)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("Error testing connection:", error)
      toast.error(`Failed to test ${service} connection`)
    } finally {
      setTesting(null)
    }
  }

  const getUsagePercentage = (usage: any) => {
    if (!usage) return 0
    return (usage.requests / usage.limit) * 100
  }

  return (
    <div className="space-y-6">
      {/* Spotify Configuration */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Music className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white">Spotify API</CardTitle>
                <p className="text-gray-400 text-sm">Configure Spotify Web API access</p>
              </div>
            </div>
            <Badge
              variant={apiStatus?.spotify?.connected ? "default" : "destructive"}
              className={apiStatus?.spotify?.connected ? "bg-green-600" : "bg-red-600"}
            >
              {apiStatus?.spotify?.connected ? (
                <><CheckCircle className="h-3 w-3 mr-1" /> Connected</>
              ) : (
                <><XCircle className="h-3 w-3 mr-1" /> Disconnected</>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="spotify-client-id">Client ID</Label>
              <Input
                id="spotify-client-id"
                value={spotifyConfig.clientId}
                onChange={(e) => setSpotifyConfig(prev => ({ ...prev, clientId: e.target.value }))}
                placeholder="Your Spotify Client ID"
                className="bg-black/30 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spotify-client-secret">Client Secret</Label>
              <Input
                id="spotify-client-secret"
                type="password"
                value={spotifyConfig.clientSecret}
                onChange={(e) => setSpotifyConfig(prev => ({ ...prev, clientSecret: e.target.value }))}
                placeholder="Your Spotify Client Secret"
                className="bg-black/30 border-white/10 text-white"
              />
            </div>
          </div>

          {apiStatus?.spotify?.usage && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">API Usage</span>
                <span className="text-green-400">
                  {apiStatus.spotify.usage.requests} / {apiStatus.spotify.usage.limit}
                </span>
              </div>
              <Progress value={getUsagePercentage(apiStatus.spotify.usage)} className="h-2" />
              <p className="text-xs text-gray-400">
                Resets on {new Date(apiStatus.spotify.usage.resetDate).toLocaleDateString()}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleSaveSpotify}
              disabled={saving === 'spotify'}
              className="bg-green-600 hover:bg-green-700"
            >
              {saving === 'spotify' ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
              ) : (
                "Save Configuration"
              )}
            </Button>
            <Button
              onClick={() => handleTestConnection('spotify')}
              disabled={testing === 'spotify'}
              variant="outline"
              className="border-white/10 text-white hover:bg-white/10"
            >
              {testing === 'spotify' ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Testing...</>
              ) : (
                "Test Connection"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* YouTube Configuration */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <Play className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white">YouTube API</CardTitle>
                <p className="text-gray-400 text-sm">Configure YouTube Data API v3 access</p>
              </div>
            </div>
            <Badge
              variant={apiStatus?.youtube?.connected ? "default" : "destructive"}
              className={apiStatus?.youtube?.connected ? "bg-green-600" : "bg-red-600"}
            >
              {apiStatus?.youtube?.connected ? (
                <><CheckCircle className="h-3 w-3 mr-1" /> Connected</>
              ) : (
                <><XCircle className="h-3 w-3 mr-1" /> Disconnected</>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="youtube-api-key">API Key</Label>
            <Input
              id="youtube-api-key"
              type="password"
              value={youtubeConfig.apiKey}
              onChange={(e) => setYoutubeConfig(prev => ({ ...prev, apiKey: e.target.value }))}
              placeholder="Your YouTube Data API Key"
              className="bg-black/30 border-white/10 text-white"
            />
          </div>

          {apiStatus?.youtube?.usage && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">API Usage</span>
                <span className="text-red-400">
                  {apiStatus.youtube.usage.requests} / {apiStatus.youtube.usage.limit}
                </span>
              </div>
              <Progress value={getUsagePercentage(apiStatus.youtube.usage)} className="h-2" />
              <p className="text-xs text-gray-400">
                Resets on {new Date(apiStatus.youtube.usage.resetDate).toLocaleDateString()}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleSaveYoutube}
              disabled={saving === 'youtube'}
              className="bg-red-600 hover:bg-red-700"
            >
              {saving === 'youtube' ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
              ) : (
                "Save Configuration"
              )}
            </Button>
            <Button
              onClick={() => handleTestConnection('youtube')}
              disabled={testing === 'youtube'}
              variant="outline"
              className="border-white/10 text-white hover:bg-white/10"
            >
              {testing === 'youtube' ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Testing...</>
              ) : (
                "Test Connection"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}