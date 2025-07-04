import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { getSpotifyUserPlaylists, getSpotifyPlaylistTracks, convertSpotifyPlaylist } from "@/api/spotify"
import { toast } from "sonner"
import { Music, ExternalLink, CheckCircle, Clock, User, List } from "lucide-react"

interface SpotifyImportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportComplete: (playlists: any[]) => void
}

export function SpotifyImportModal({ open, onOpenChange, onImportComplete }: SpotifyImportModalProps) {
  const [step, setStep] = useState<'input' | 'playlists' | 'converting' | 'complete'>('input')
  const [spotifyUserId, setSpotifyUserId] = useState("22wj5sgby2ffgbu654vsttykq")
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [converting, setConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentPlaylist, setCurrentPlaylist] = useState("")
  const [convertedPlaylists, setConvertedPlaylists] = useState([])

  const extractUserIdFromUrl = (url: string) => {
    const match = url.match(/user\/([^\/\?]+)/)
    return match ? match[1] : url
  }

  const handleFetchPlaylists = async () => {
    const userId = extractUserIdFromUrl(spotifyUserId)
    if (!userId.trim()) {
      toast.error("Please enter a valid Spotify user ID or URL")
      return
    }

    setLoading(true)
    try {
      console.log("Fetching playlists for user:", userId)
      const result = await getSpotifyUserPlaylists(userId)
      setPlaylists(result.playlists)
      setStep('playlists')
      console.log("Found", result.playlists.length, "playlists")
    } catch (error) {
      console.error("Error fetching playlists:", error)
      toast.error("Failed to fetch Spotify playlists")
    } finally {
      setLoading(false)
    }
  }

  const handlePlaylistSelection = (playlistId: string, checked: boolean) => {
    setSelectedPlaylists(prev =>
      checked
        ? [...prev, playlistId]
        : prev.filter(id => id !== playlistId)
    )
  }

  const handleConvertPlaylists = async () => {
    if (selectedPlaylists.length === 0) {
      toast.error("Please select at least one playlist to convert")
      return
    }

    setConverting(true)
    setStep('converting')
    setProgress(0)

    const converted = []

    try {
      for (let i = 0; i < selectedPlaylists.length; i++) {
        const playlistId = selectedPlaylists[i]
        const playlist = playlists.find(p => p.id === playlistId)

        setCurrentPlaylist(playlist.name)
        setProgress((i / selectedPlaylists.length) * 100)

        console.log("Converting playlist:", playlist.name)

        // Get playlist tracks
        const tracksResult = await getSpotifyPlaylistTracks(playlistId)

        // Convert to YouTube
        const conversionResult = await convertSpotifyPlaylist(
          playlistId,
          playlist.name,
          tracksResult.tracks
        )

        converted.push(conversionResult.convertedPlaylist)
      }

      setProgress(100)
      setConvertedPlaylists(converted)
      setStep('complete')

      console.log("Conversion completed for", converted.length, "playlists")

    } catch (error) {
      console.error("Error converting playlists:", error)
      toast.error("Failed to convert playlists")
    } finally {
      setConverting(false)
    }
  }

  const handleComplete = () => {
    onImportComplete(convertedPlaylists)
    handleClose()
    toast.success(`Successfully imported ${convertedPlaylists.length} playlists`)
  }

  const handleClose = () => {
    setStep('input')
    setSpotifyUserId("22wj5sgby2ffgbu654vsttykq")
    setPlaylists([])
    setSelectedPlaylists([])
    setConvertedPlaylists([])
    setProgress(0)
    setCurrentPlaylist("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-white/10 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Import Spotify Playlists</DialogTitle>
          <DialogDescription className="text-gray-300">
            Import and convert your Spotify playlists to YouTube music videos
          </DialogDescription>
        </DialogHeader>

        {step === 'input' && (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="spotify-user" className="text-white">Spotify User ID or Profile URL</Label>
              <Input
                id="spotify-user"
                placeholder="https://open.spotify.com/user/username or just username"
                value={spotifyUserId}
                onChange={(e) => setSpotifyUserId(e.target.value)}
                className="bg-black/30 border-white/10 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-blue-400 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-300">Spotify User Import</h4>
                  <p className="text-sm text-gray-300">
                    This will fetch all public playlists from the specified Spotify user and convert them to YouTube music video playlists.
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleFetchPlaylists}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? "Fetching Playlists..." : "Fetch Playlists"}
            </Button>
          </div>
        )}

        {step === 'playlists' && (
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Select Playlists to Convert</h3>
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                {playlists.length} playlists found
              </Badge>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {playlists.map((playlist) => (
                <Card key={playlist.id} className="bg-black/30 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedPlaylists.includes(playlist.id)}
                        onCheckedChange={(checked) => handlePlaylistSelection(playlist.id, checked)}
                      />
                      <img
                        src={playlist.images[0]?.url || '/placeholder-playlist.png'}
                        alt={playlist.name}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">{playlist.name}</h4>
                        <p className="text-sm text-gray-300 truncate">{playlist.description}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <List className="h-3 w-3" />
                            {playlist.tracks.total} tracks
                          </div>
                          <a
                            href={playlist.external_urls.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View on Spotify
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setStep('input')}
                variant="outline"
                className="border-white/10 text-white hover:bg-white/10"
              >
                Back
              </Button>
              <Button
                onClick={handleConvertPlaylists}
                disabled={selectedPlaylists.length === 0}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Convert {selectedPlaylists.length} Playlist{selectedPlaylists.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        )}

        {step === 'converting' && (
          <div className="space-y-6 py-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="h-8 w-8 text-green-400 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Converting Playlists</h3>
              <p className="text-gray-300">Finding YouTube videos for your Spotify tracks...</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Progress</span>
                <span className="text-green-400">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              {currentPlaylist && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Clock className="h-4 w-4" />
                  Converting: {currentPlaylist}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Conversion Complete!</h3>
              <p className="text-gray-300">Your playlists have been successfully converted</p>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {convertedPlaylists.map((playlist) => (
                <Card key={playlist.id} className="bg-black/30 border-white/10">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-white mb-2">{playlist.name}</h4>
                    <div className="grid grid-cols-4 gap-4 text-center text-sm">
                      <div>
                        <div className="text-lg font-bold text-blue-400">{playlist.conversionStats.total}</div>
                        <div className="text-gray-400">Total</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-400">{playlist.conversionStats.converted}</div>
                        <div className="text-gray-400">Converted</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-red-400">{playlist.conversionStats.failed}</div>
                        <div className="text-gray-400">Failed</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-400">{playlist.conversionStats.successRate}%</div>
                        <div className="text-gray-400">Success</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button onClick={handleComplete} className="w-full bg-green-600 hover:bg-green-700 text-white">
              Complete Import
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}