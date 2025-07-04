import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { searchTracks, addTrackToQueue } from "@/api/music"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  source: 'spotify' | 'youtube'
  thumbnail: string
  url?: string
}

interface SearchSectionProps {
  onAddToQueue: (track: Track) => void
}

export function SearchSection({ onAddToQueue }: SearchSectionProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{ spotify: Track[], youtube: Track[] }>({ spotify: [], youtube: [] })
  const [loading, setLoading] = useState(false)
  const [addingTrack, setAddingTrack] = useState<string | null>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      console.log("Searching for:", query)
      const response = await searchTracks(query)
      setResults(response.results)
      console.log("Search results:", response.results.spotify.length + response.results.youtube.length, "tracks found")
    } catch (error) {
      console.error("Search error:", error)
      toast.error("Failed to search tracks")
      setResults({ spotify: [], youtube: [] })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleAddTrack = async (track: Track) => {
    if (addingTrack === track.id) return

    setAddingTrack(track.id)
    try {
      await addTrackToQueue(track)
      onAddToQueue(track)
      console.log("Adding track to queue:", track.title)
      toast.success(`Added "${track.title}" to queue`)
    } catch (error) {
      console.error("Error adding track:", error)
      toast.error("Failed to add track to queue")
    } finally {
      setAddingTrack(null)
    }
  }

  const renderTrackList = (tracks: Track[], source: 'spotify' | 'youtube') => (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {tracks.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <div className="text-sm">No {source} results found</div>
        </div>
      ) : (
        tracks.map((track) => (
          <div
            key={track.id}
            className="bg-black/30 rounded-lg p-3 border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex items-center gap-3">
              <img
                src={track.thumbnail}
                alt={track.album}
                className="w-12 h-12 rounded object-cover"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-white truncate">{track.title}</h4>
                  <Badge
                    variant={track.source === 'spotify' ? 'default' : 'secondary'}
                    className={cn(
                      "text-xs",
                      track.source === 'spotify' ? "bg-green-600" : "bg-red-600"
                    )}
                  >
                    {track.source === 'spotify' ? '♫' : '▶'}
                  </Badge>
                </div>
                <p className="text-gray-300 text-sm truncate">{track.artist}</p>
                <p className="text-gray-400 text-xs truncate">{track.album}</p>
              </div>

              <div className="text-gray-400 text-sm">
                {formatTime(track.duration)}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleAddTrack(track)}
                disabled={addingTrack === track.id}
                className="text-purple-400 hover:bg-purple-500/20 h-8 w-8"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Search Music</h2>
      </div>

      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search for songs, artists, or albums..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 bg-black/30 border-white/10 text-white placeholder:text-gray-400"
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Results */}
      {(results.spotify.length > 0 || results.youtube.length > 0) && (
        <Tabs defaultValue="spotify" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-black/30">
            <TabsTrigger
              value="spotify"
              className="text-white data-[state=active]:bg-green-600"
            >
              Spotify ({results.spotify.length})
            </TabsTrigger>
            <TabsTrigger
              value="youtube"
              className="text-white data-[state=active]:bg-red-600"
            >
              YouTube ({results.youtube.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="spotify">
            {renderTrackList(results.spotify, 'spotify')}
          </TabsContent>

          <TabsContent value="youtube">
            {renderTrackList(results.youtube, 'youtube')}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}