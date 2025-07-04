import { useState, useEffect } from "react"
import { CurrentPlayer } from "@/components/player/CurrentPlayer"
import { PlaylistQueue } from "@/components/player/PlaylistQueue"
import { SearchSection } from "@/components/search/SearchSection"
import { LibrarySidebar } from "@/components/library/LibrarySidebar"
import { ImportPlaylistModal } from "@/components/modals/ImportPlaylistModal"
import { SpotifyImportModal } from "@/components/modals/SpotifyImportModal"
import { getPlaylists, getCurrentTrack, getQueue } from "@/api/music"
import { toast } from "sonner"

export function Dashboard() {
  const [currentTrack, setCurrentTrack] = useState(null)
  const [queue, setQueue] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isSpotifyImportModalOpen, setIsSpotifyImportModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      console.log("Loading dashboard data...")
      const [trackData, queueData, playlistData] = await Promise.all([
        getCurrentTrack(),
        getQueue(),
        getPlaylists()
      ])
      
      setCurrentTrack(trackData.track)
      setQueue(queueData.queue)
      setPlaylists(playlistData.playlists)
      console.log("Dashboard data loaded successfully")
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      toast.error("Failed to load music data")
    } finally {
      setLoading(false)
    }
  }

  const handleTrackChange = (track) => {
    console.log("Track changed:", track.title)
    setCurrentTrack(track)
  }

  const handleQueueUpdate = (newQueue) => {
    console.log("Queue updated, new length:", newQueue.length)
    setQueue(newQueue)
  }

  const handleSpotifyImportComplete = (importedPlaylists) => {
    console.log("Spotify import completed:", importedPlaylists.length, "playlists")
    const updatedPlaylists = [...playlists, ...importedPlaylists.map(playlist => ({
      id: `imported_${playlist.id}_${Date.now()}`, // Make unique key
      name: playlist.name,
      trackCount: playlist.tracks.length,
      source: 'converted',
      thumbnail: playlist.tracks[0]?.thumbnail || '/placeholder-playlist.png',
      createdAt: new Date().toISOString(),
      originalSpotifyUrl: playlist.originalSpotifyUrl
    }))]
    setPlaylists(updatedPlaylists)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="h-full flex gap-6">
      {/* Left Sidebar - Library */}
      <div className="w-80">
        <LibrarySidebar
          playlists={playlists}
          onImportPlaylist={() => setIsImportModalOpen(true)}
          onSpotifyImport={() => setIsSpotifyImportModalOpen(true)}
          onPlaylistSelect={(playlist) => console.log("Playlist selected:", playlist.name)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Current Player */}
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <CurrentPlayer
            track={currentTrack}
            onTrackChange={handleTrackChange}
          />
        </div>

        {/* Search Section */}
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <SearchSection onAddToQueue={(track) => {
            const newQueue = [...queue, track]
            setQueue(newQueue)
            toast.success(`Added "${track.title}" to queue`)
          }} />
        </div>

        {/* Queue */}
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6 flex-1">
          <PlaylistQueue
            queue={queue}
            onQueueUpdate={handleQueueUpdate}
            onTrackSelect={handleTrackChange}
          />
        </div>
      </div>

      {/* Import Modals */}
      <ImportPlaylistModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onImportComplete={(playlist) => {
          setPlaylists([...playlists, playlist])
          toast.success(`Imported playlist: ${playlist.name}`)
        }}
      />

      <SpotifyImportModal
        open={isSpotifyImportModalOpen}
        onOpenChange={setIsSpotifyImportModalOpen}
        onImportComplete={handleSpotifyImportComplete}
      />
    </div>
  )
}