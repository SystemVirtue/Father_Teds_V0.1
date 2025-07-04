import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { importPlaylist } from "@/api/music"
import { toast } from "sonner"
import { Music, ExternalLink, CheckCircle, XCircle, Clock } from "lucide-react"

interface ImportPlaylistModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportComplete: (playlist: any) => void
}

export function ImportPlaylistModal({ open, onOpenChange, onImportComplete }: ImportPlaylistModalProps) {
  const [url, setUrl] = useState("")
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTrack, setCurrentTrack] = useState("")
  const [conversionResults, setConversionResults] = useState(null)

  const handleImport = async (type: 'spotify' | 'youtube') => {
    if (!url.trim()) {
      toast.error("Please enter a playlist URL")
      return
    }

    setImporting(true)
    setProgress(0)
    setCurrentTrack("")
    setConversionResults(null)

    try {
      console.log("Starting playlist import:", type, url)

      // Simulate progress for Spotify conversion
      if (type === 'spotify') {
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            const newProgress = prev + Math.random() * 10
            if (newProgress >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return newProgress
          })
        }, 200)

        const trackInterval = setInterval(() => {
          const tracks = [
            "Bohemian Rhapsody - Queen",
            "Stairway to Heaven - Led Zeppelin",
            "Hotel California - Eagles",
            "Sweet Child O' Mine - Guns N' Roses",
            "Don't Stop Believin' - Journey"
          ]
          setCurrentTrack(tracks[Math.floor(Math.random() * tracks.length)])
        }, 800)

        setTimeout(() => {
          clearInterval(progressInterval)
          clearInterval(trackInterval)
          setProgress(100)
        }, 3000)
      }

      const result = await importPlaylist(url, type)

      setConversionResults(result.playlist)
      console.log("Import completed:", result.playlist.name)

      setTimeout(() => {
        onImportComplete(result.playlist)
        handleClose()
        toast.success(`Successfully imported: ${result.playlist.name}`)
      }, 1000)

    } catch (error) {
      console.error("Import error:", error)
      toast.error("Failed to import playlist")
    } finally {
      setImporting(false)
    }
  }

  const handleClose = () => {
    setUrl("")
    setImporting(false)
    setProgress(0)
    setCurrentTrack("")
    setConversionResults(null)
    onOpenChange(false)
  }

  const isValidUrl = (url: string, type: 'spotify' | 'youtube') => {
    if (type === 'spotify') {
      return url.includes('spotify.com/playlist/')
    }
    return url.includes('youtube.com/playlist') || url.includes('youtu.be/playlist')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-white/10 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Import Playlist</DialogTitle>
          <DialogDescription className="text-gray-300">
            Import playlists from Spotify or YouTube and convert them to your library
          </DialogDescription>
        </DialogHeader>

        {!importing && !conversionResults ? (
          <Tabs defaultValue="spotify" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-black/30">
              <TabsTrigger value="spotify" className="text-white data-[state=active]:bg-green-600">
                Spotify Playlist
              </TabsTrigger>
              <TabsTrigger value="youtube" className="text-white data-[state=active]:bg-red-600">
                YouTube Playlist
              </TabsTrigger>
            </TabsList>

            <TabsContent value="spotify" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="spotify-url">Spotify Playlist URL</Label>
                <Input
                  id="spotify-url"
                  placeholder="https://open.spotify.com/playlist/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-black/30 border-white/10 text-white"
                />
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Music className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-300">Spotify Conversion</h4>
                    <p className="text-sm text-gray-300">
                      This will automatically convert your Spotify playlist to YouTube music videos.
                      The system will search for matching videos and show conversion progress.
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleImport('spotify')}
                disabled={!isValidUrl(url, 'spotify')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Import & Convert Spotify Playlist
              </Button>
            </TabsContent>

            <TabsContent value="youtube" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="youtube-url">YouTube Playlist URL</Label>
                <Input
                  id="youtube-url"
                  placeholder="https://www.youtube.com/playlist?list=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-black/30 border-white/10 text-white"
                />
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <ExternalLink className="h-5 w-5 text-red-400 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-300">YouTube Import</h4>
                    <p className="text-sm text-gray-300">
                      Import videos directly from a YouTube playlist. No conversion needed.
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleImport('youtube')}
                disabled={!isValidUrl(url, 'youtube')}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Import YouTube Playlist
              </Button>
            </TabsContent>
          </Tabs>
        ) : importing ? (
          <div className="space-y-6 py-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="h-8 w-8 text-purple-400 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold mb-2">Converting Playlist</h3>
              <p className="text-gray-300">Finding YouTube videos for your Spotify tracks...</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Progress</span>
                <span className="text-purple-400">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              {currentTrack && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Clock className="h-4 w-4" />
                  Converting: {currentTrack}
                </div>
              )}
            </div>
          </div>
        ) : conversionResults && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Conversion Complete!</h3>
              <p className="text-gray-300">Your playlist has been successfully imported</p>
            </div>

            <div className="bg-black/30 rounded-lg p-4 border border-white/10">
              <h4 className="font-medium text-white mb-3">{conversionResults.name}</h4>
              {conversionResults.conversionStatus && (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">
                      {conversionResults.conversionStatus.total}
                    </div>
                    <div className="text-xs text-gray-400">Total Tracks</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {conversionResults.conversionStatus.converted}
                    </div>
                    <div className="text-xs text-gray-400">Converted</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">
                      {conversionResults.conversionStatus.failed}
                    </div>
                    <div className="text-xs text-gray-400">Failed</div>
                  </div>
                </div>
              )}
            </div>

            <Button onClick={handleClose} className="w-full bg-purple-600 hover:bg-purple-700">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}