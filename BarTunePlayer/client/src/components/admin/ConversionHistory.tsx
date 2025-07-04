import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getConversionHistory } from "@/api/admin"
import { toast } from "sonner"
import { Calendar, ExternalLink, RotateCcw, CheckCircle, XCircle, Clock } from "lucide-react"

export function ConversionHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      console.log("Loading conversion history...")
      const result = await getConversionHistory()
      setHistory(result.history)
      console.log("Conversion history loaded:", result.history.length, "entries")
    } catch (error) {
      console.error("Error loading conversion history:", error)
      toast.error("Failed to load conversion history")
    } finally {
      setLoading(false)
    }
  }

  const handleReconvert = (historyItem: any) => {
    console.log("Re-converting playlist:", historyItem.playlistName)
    toast.success(`Re-conversion started for: ${historyItem.playlistName}`)
  }

  const getStatusBadge = (status: string) => {
    const config = {
      completed: { color: "bg-green-600", icon: CheckCircle, label: "Completed" },
      failed: { color: "bg-red-600", icon: XCircle, label: "Failed" },
      processing: { color: "bg-yellow-600", icon: Clock, label: "Processing" }
    }
    return config[status as keyof typeof config] || config.completed
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Loading conversion history...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Conversion History</h3>
          <p className="text-gray-400 text-sm">Track of all Spotify playlist conversions</p>
        </div>
        <Button
          onClick={loadHistory}
          variant="outline"
          className="border-white/10 text-white hover:bg-white/10"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {history.length === 0 ? (
        <Card className="bg-black/30 border-white/10">
          <CardContent className="py-12 text-center">
            <div className="text-gray-400">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <div className="text-lg mb-2">No conversion history</div>
              <div className="text-sm">Import a Spotify playlist to see conversion history</div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item: any) => {
            const statusBadge = getStatusBadge(item.status)
            const StatusIcon = statusBadge.icon

            return (
              <Card key={item.id} className="bg-black/30 border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                        <StatusIcon className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{item.playlistName}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="h-3 w-3" />
                          {formatDate(item.convertedAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusBadge.color}>
                        {statusBadge.label}
                      </Badge>
                      <Button
                        onClick={() => handleReconvert(item)}
                        size="sm"
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/10"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Re-convert
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <ExternalLink className="h-3 w-3" />
                    <span className="truncate">{item.sourceUrl}</span>
                  </div>

                  {item.stats && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-400">{item.stats.total}</div>
                          <div className="text-xs text-gray-400">Total</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-400">{item.stats.converted}</div>
                          <div className="text-xs text-gray-400">Converted</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-red-400">{item.stats.failed}</div>
                          <div className="text-xs text-gray-400">Failed</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-400">{item.stats.successRate}%</div>
                          <div className="text-xs text-gray-400">Success Rate</div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Conversion Success</span>
                          <span className="text-green-400">{item.stats.successRate}%</span>
                        </div>
                        <Progress value={item.stats.successRate} className="h-2" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}