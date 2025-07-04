import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Monitor, Volume2, Play, Settings } from "lucide-react"
import { updateSystemSettings } from "@/api/admin"
import { toast } from "sonner"

interface SystemSettingsProps {
  settings: any
  onSettingsUpdate: (settings: any) => void
}

export function SystemSettings({ settings, onSettingsUpdate }: SystemSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings || {})
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      console.log("Saving system settings:", localSettings)
      await updateSystemSettings(localSettings)
      onSettingsUpdate(localSettings)
      toast.success("System settings saved successfully")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save system settings")
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (category: string, key: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Display Configuration */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Monitor className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">Display Configuration</CardTitle>
              <p className="text-gray-400 text-sm">Configure monitor settings and display options</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary Monitor</Label>
              <Select
                value={localSettings.displayConfig?.primaryMonitor}
                onValueChange={(value) => updateSetting('displayConfig', 'primaryMonitor', value)}
              >
                <SelectTrigger className="bg-black/30 border-white/10 text-white">
                  <SelectValue placeholder="Select primary monitor" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/10">
                  <SelectItem value="Monitor 1">Monitor 1 (1920x1080)</SelectItem>
                  <SelectItem value="Monitor 2">Monitor 2 (2560x1440)</SelectItem>
                  <SelectItem value="Monitor 3">Monitor 3 (3840x2160)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Secondary Monitor</Label>
              <Select
                value={localSettings.displayConfig?.secondaryMonitor}
                onValueChange={(value) => updateSetting('displayConfig', 'secondaryMonitor', value)}
              >
                <SelectTrigger className="bg-black/30 border-white/10 text-white">
                  <SelectValue placeholder="Select secondary monitor" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/10">
                  <SelectItem value="Monitor 1">Monitor 1 (1920x1080)</SelectItem>
                  <SelectItem value="Monitor 2">Monitor 2 (2560x1440)</SelectItem>
                  <SelectItem value="Monitor 3">Monitor 3 (3840x2160)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Fullscreen Mode</Label>
              <p className="text-sm text-gray-400">Enable fullscreen video display on secondary monitor</p>
            </div>
            <Switch
              checked={localSettings.displayConfig?.fullscreenMode}
              onCheckedChange={(checked) => updateSetting('displayConfig', 'fullscreenMode', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Audio Output */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Volume2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">Audio Output</CardTitle>
              <p className="text-gray-400 text-sm">Configure audio device and volume settings</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Audio Device</Label>
            <Select
              value={localSettings.audioOutput?.device}
              onValueChange={(value) => updateSetting('audioOutput', 'device', value)}
            >
              <SelectTrigger className="bg-black/30 border-white/10 text-white">
                <SelectValue placeholder="Select audio device" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/10">
                <SelectItem value="Default Audio Device">Default Audio Device</SelectItem>
                <SelectItem value="Speakers">Speakers (Realtek Audio)</SelectItem>
                <SelectItem value="Headphones">Headphones (USB Audio)</SelectItem>
                <SelectItem value="HDMI">HDMI Audio Output</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Master Volume</Label>
              <span className="text-sm text-gray-400">{localSettings.audioOutput?.volume}%</span>
            </div>
            <Slider
              value={[localSettings.audioOutput?.volume || 75]}
              onValueChange={(value) => updateSetting('audioOutput', 'volume', value[0])}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Crossfade Duration</Label>
              <span className="text-sm text-gray-400">{localSettings.audioOutput?.crossfadeDuration}s</span>
            </div>
            <Slider
              value={[localSettings.audioOutput?.crossfadeDuration || 3]}
              onValueChange={(value) => updateSetting('audioOutput', 'crossfadeDuration', value[0])}
              max={10}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Playback Preferences */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Play className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">Playback Preferences</CardTitle>
              <p className="text-gray-400 text-sm">Default playback behavior settings</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Default Shuffle</Label>
              <p className="text-sm text-gray-400">Enable shuffle by default for new playlists</p>
            </div>
            <Switch
              checked={localSettings.playbackPreferences?.defaultShuffle}
              onCheckedChange={(checked) => updateSetting('playbackPreferences', 'defaultShuffle', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Default Repeat</Label>
              <p className="text-sm text-gray-400">Enable repeat by default for new playlists</p>
            </div>
            <Switch
              checked={localSettings.playbackPreferences?.defaultRepeat}
              onCheckedChange={(checked) => updateSetting('playbackPreferences', 'defaultRepeat', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Autoplay</Label>
              <p className="text-sm text-gray-400">Automatically start playing when tracks are added</p>
            </div>
            <Switch
              checked={localSettings.playbackPreferences?.autoplay}
              onCheckedChange={(checked) => updateSetting('playbackPreferences', 'autoplay', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Conversion Preferences */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">Conversion Preferences</CardTitle>
              <p className="text-gray-400 text-sm">Spotify to YouTube conversion settings</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Matching Sensitivity</Label>
            <Select
              value={localSettings.conversionPreferences?.matchingSensitivity}
              onValueChange={(value) => updateSetting('conversionPreferences', 'matchingSensitivity', value)}
            >
              <SelectTrigger className="bg-black/30 border-white/10 text-white">
                <SelectValue placeholder="Select matching sensitivity" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/10">
                <SelectItem value="low">Low - More results, less accuracy</SelectItem>
                <SelectItem value="medium">Medium - Balanced matching</SelectItem>
                <SelectItem value="high">High - Fewer results, higher accuracy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Preferred Video Type</Label>
            <Select
              value={localSettings.conversionPreferences?.preferredVideoType}
              onValueChange={(value) => updateSetting('conversionPreferences', 'preferredVideoType', value)}
            >
              <SelectTrigger className="bg-black/30 border-white/10 text-white">
                <SelectValue placeholder="Select preferred video type" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/10">
                <SelectItem value="official">Official Music Videos</SelectItem>
                <SelectItem value="audio">Audio Only</SelectItem>
                <SelectItem value="live">Live Performances</SelectItem>
                <SelectItem value="any">Any Available</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-approve Conversions</Label>
              <p className="text-sm text-gray-400">Automatically approve high-confidence matches</p>
            </div>
            <Switch
              checked={localSettings.conversionPreferences?.autoApprove}
              onCheckedChange={(checked) => updateSetting('conversionPreferences', 'autoApprove', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleSave} 
        disabled={saving}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        {saving ? "Saving..." : "Save All Settings"}
      </Button>
    </div>
  )
}