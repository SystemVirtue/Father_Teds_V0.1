import { useState } from "react"
import { Plus, Music, Calendar, Play, MoreVertical, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { addPlaylistToQueue } from "@/api/music"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Playlist {
  id: string
  name: string
  trackCount: number
  source: 'spotify' | 'youtube' | 'converted' | 'manual'
  thumbnail: string
  createdAt: string
  originalSpotifyUrl?: string
}

interface LibrarySidebarProps {
  playlists: Playlist[]
  onImportPlaylist: () => void
  onSpotifyImport: () => void
  onPlaylistSelect: (playlist: Playlist) => void
}

export function LibrarySidebar({ playlists, onImportPlaylist, onSpotifyImport, onPlaylistSelect }: LibrarySidebarProps) {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null)

  const getSourceBadge = (source: string) => {
    const config = {
      spotify: { color: "bg-green-600", icon: "♫", label: "Spotify" },
      youtube: { color: "bg-red-600", icon: "▶", label: "YouTube" },
      converted: { color: "bg-blue-600", icon: "🔄", label: "Converted" },
      manual: { color: "bg-purple-600", icon: "✋", label: "Manual" }
    }
    return config[source as keyof typeof config] || config.manual
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handlePlaylistClick = (playlist: Playlist) => {
    console.log("Playlist selected:", playlist.name)
    setSelectedPlaylist(playlist.id)
    onPlaylistSelect(playlist)
  }

  const handleAddToQueue = async (playlist: Playlist) => {
    try {
      console.log("Adding playlist to queue:", playlist.name)
      const result = await addPlaylistToQueue(playlist.id)
      toast.success(`Added ${result.addedCount} tracks to queue`)
    } catch (error) {
      console.error("Error adding playlist to queue:", error)
      toast.error("Failed to add playlist to queue")
    }
  }

  return (
    <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6 h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Library</h2>
          <div className="flex gap-2">
            <Button
              onClick={onSpotifyImport}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Spotify
            </Button>
            <Button
              onClick={onImportPlaylist}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Import
            </Button>
          </div>
        </div>

        {/* Recently Played */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-300">Recently Played</h3>
          <div className="bg-black/30 rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                <Music className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">Liked Songs</p>
                <p className="text-gray-400 text-xs">Mixed sources</p>
              </div>
            </div>
          </div>
        </div>

        {/* Playlists */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-300">Playlists</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {playlists.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Music className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <div className="text-sm">No playlists yet</div>
                <div className="text-xs">Import or create your first playlist</div>
              </div>
            ) : (
              playlists.map((playlist) => {
                const sourceBadge = getSourceBadge(playlist.source)
                const isSelected = selectedPlaylist === playlist.id

                return (
                  <div
                    key={playlist.id}
                    className={cn(
                      "bg-black/30 rounded-lg p-3 border border-white/10 hover:border-white/20 transition-all cursor-pointer",
                      isSelected && "border-purple-500/50 bg-purple-500/10"
                    )}
                    onClick={() => handlePlaylistClick(playlist)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={playlist.thumbnail}
                        alt={playlist.name}
                        className="w-12 h-12 rounded object-cover"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-white text-sm truncate">
                            {playlist.name}
                          </h4>
                          <Badge
                            className={cn("text-xs", sourceBadge.color)}
                          >
                            {sourceBadge.icon}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-xs">
                          {playlist.trackCount} tracks
                        </p>
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <Calendar className="h-3 w-3" />
                          {formatDate(playlist.createdAt)}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-white h-6 w-6"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-black/90 border-white/10">
                          <DropdownMenuItem 
                            className="text-white hover:bg-white/10"
                            onClick={() => handleAddToQueue(playlist)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add to Queue
                          </DropdownMenuItem>
                          {playlist.originalSpotifyUrl && (
                            <DropdownMenuItem className="text-white hover:bg-white/10">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              <a href={playlist.originalSpotifyUrl} target="_blank" rel="noopener noreferrer">
                                View Original
                              </a>
                            </DropdownMenuItem>
                          )}
                          {playlist.source === 'converted' && (
                            <DropdownMenuItem className="text-white hover:bg-white/10">
                              🔄 Re-convert
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}