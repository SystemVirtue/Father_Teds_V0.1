import { useState, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { togglePlayback, seekToPosition, setVolume, skipToNext, skipToPrevious } from "@/api/music"
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

interface CurrentPlayerProps {
  track: Track | null
  onTrackChange: (track: Track) => void
}

export function CurrentPlayer({ track, onTrackChange }: CurrentPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolumeState] = useState(75)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && track) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= track.duration) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, track])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayPause = async () => {
    if (loading) return
    
    setLoading(true)
    try {
      const result = await togglePlayback()
      setIsPlaying(result.isPlaying)
      console.log(result.isPlaying ? "Playing track" : "Pausing track", track?.title)
    } catch (error) {
      console.error("Error toggling playback:", error)
      toast.error("Failed to toggle playback")
    } finally {
      setLoading(false)
    }
  }

  const handleSeek = async (value: number[]) => {
    const newTime = value[0]
    try {
      await seekToPosition(newTime)
      setCurrentTime(newTime)
      console.log("Seeking to:", formatTime(newTime))
    } catch (error) {
      console.error("Error seeking:", error)
      toast.error("Failed to seek")
    }
  }

  const handleVolumeChange = async (value: number[]) => {
    const newVolume = value[0]
    try {
      await setVolume(newVolume)
      setVolumeState(newVolume)
      console.log("Volume changed to:", newVolume)
    } catch (error) {
      console.error("Error setting volume:", error)
      toast.error("Failed to set volume")
    }
  }

  const handleNext = async () => {
    if (loading) return
    
    setLoading(true)
    try {
      const result = await skipToNext()
      if (result.track) {
        onTrackChange(result.track)
      }
      console.log("Skipped to next track")
    } catch (error) {
      console.error("Error skipping to next:", error)
      toast.error("Failed to skip to next track")
    } finally {
      setLoading(false)
    }
  }

  const handlePrevious = async () => {
    if (loading) return
    
    setLoading(true)
    try {
      const result = await skipToPrevious()
      if (result.track) {
        onTrackChange(result.track)
      }
      console.log("Skipped to previous track")
    } catch (error) {
      console.error("Error skipping to previous:", error)
      toast.error("Failed to skip to previous track")
    } finally {
      setLoading(false)
    }
  }

  if (!track) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-400">
        <div className="text-center">
          <div className="text-lg mb-2">No track selected</div>
          <div className="text-sm">Choose a song to start playing</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {/* Album Art */}
        <div className="relative">
          <img
            src={track.thumbnail}
            alt={track.album}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <Badge
            variant={track.source === 'spotify' ? 'default' : 'secondary'}
            className={cn(
              "absolute -top-2 -right-2 text-xs",
              track.source === 'spotify' ? "bg-green-600" : "bg-red-600"
            )}
          >
            {track.source === 'spotify' ? '♫' : '▶'}
          </Badge>
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white truncate">{track.title}</h3>
          <p className="text-gray-300 truncate">{track.artist}</p>
          <p className="text-gray-400 text-sm truncate">{track.album}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShuffle(!shuffle)}
            className={cn(
              "text-white hover:bg-white/10",
              shuffle && "text-purple-400"
            )}
          >
            <Shuffle className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            disabled={loading}
            className="text-white hover:bg-white/10"
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button
            variant="default"
            size="icon"
            onClick={handlePlayPause}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white w-12 h-12"
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            disabled={loading}
            className="text-white hover:bg-white/10"
          >
            <SkipForward className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setRepeat(!repeat)}
            className={cn(
              "text-white hover:bg-white/10",
              repeat && "text-purple-400"
            )}
          >
            <Repeat className="h-5 w-5" />
          </Button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 w-32">
          <Volume2 className="h-4 w-4 text-white" />
          <Slider
            value={[volume]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="flex-1"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Slider
          value={[currentTime]}
          onValueChange={handleSeek}
          max={track.duration}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(track.duration)}</span>
        </div>
      </div>
    </div>
  )
}