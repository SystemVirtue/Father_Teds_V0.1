import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Play, GripVertical, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { updateQueue, removeFromQueue, playTrack } from "@/api/music"
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
}

interface PlaylistQueueProps {
  queue: Track[]
  onQueueUpdate: (queue: Track[]) => void
  onTrackSelect: (track: Track) => void
}

export function PlaylistQueue({ queue, onQueueUpdate, onTrackSelect }: PlaylistQueueProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const items = Array.from(queue)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    onQueueUpdate(items)

    try {
      const queueUpdate = items.map((track, index) => ({
        id: track.id,
        position: index
      }))
      await updateQueue(queueUpdate)
      console.log("Queue reordered")
    } catch (error) {
      console.error("Error updating queue order:", error)
      toast.error("Failed to update queue order")
      // Revert the change
      onQueueUpdate(queue)
    }
  }

  const handleRemoveTrack = async (trackId: string) => {
    if (loading === trackId) return

    setLoading(trackId)
    try {
      await removeFromQueue(trackId)
      const updatedQueue = queue.filter(track => track.id !== trackId)
      onQueueUpdate(updatedQueue)
      console.log("Track removed from queue:", trackId)
      toast.success("Track removed from queue")
    } catch (error) {
      console.error("Error removing track:", error)
      toast.error("Failed to remove track from queue")
    } finally {
      setLoading(null)
    }
  }

  const handlePlayTrack = async (track: Track) => {
    if (loading === track.id) return

    setLoading(track.id)
    try {
      await playTrack(track.id)
      onTrackSelect(track)
      console.log("Playing track from queue:", track.title)
    } catch (error) {
      console.error("Error playing track:", error)
      toast.error("Failed to play track")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Queue</h2>
        <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
          {queue.length} tracks
        </Badge>
      </div>

      {queue.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-lg mb-2">Queue is empty</div>
          <div className="text-sm">Add songs to start building your playlist</div>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="queue">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2 max-h-96 overflow-y-auto"
              >
                {queue.map((track, index) => (
                  <Draggable key={track.id} draggableId={track.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "bg-black/30 rounded-lg p-3 border border-white/10 transition-all",
                          snapshot.isDragging && "shadow-lg scale-105"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            {...provided.dragHandleProps}
                            className="text-gray-400 hover:text-white cursor-grab"
                          >
                            <GripVertical className="h-4 w-4" />
                          </div>

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
                          </div>

                          <div className="text-gray-400 text-sm">
                            {formatTime(track.duration)}
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePlayTrack(track)}
                              disabled={loading === track.id}
                              className="text-white hover:bg-white/10 h-8 w-8"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveTrack(track.id)}
                              disabled={loading === track.id}
                              className="text-red-400 hover:bg-red-500/20 h-8 w-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  )
}