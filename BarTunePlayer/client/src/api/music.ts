import api from './api';

// Description: Get current playing track
// Endpoint: GET /api/music/current
// Request: {}
// Response: { track: { id: string, title: string, artist: string, album: string, duration: number, source: 'spotify' | 'youtube', thumbnail: string, url?: string } }
export const getCurrentTrack = async () => {
  try {
    return await api.get('/api/music/current');
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Get playlist queue
// Endpoint: GET /api/music/queue
// Request: {}
// Response: { queue: Array<{ id: string, title: string, artist: string, album: string, duration: number, source: 'spotify' | 'youtube', thumbnail: string }> }
export const getQueue = async () => {
  try {
    return await api.get('/api/music/queue');
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Get user playlists (now includes converted Spotify playlists)
// Endpoint: GET /api/music/playlists
// Request: {}
// Response: { playlists: Array<{ id: string, name: string, trackCount: number, source: 'spotify' | 'youtube' | 'converted' | 'manual', thumbnail: string, createdAt: string, originalSpotifyUrl?: string }> }
export const getPlaylists = async () => {
  try {
    return await api.get('/api/music/playlists');
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Get playlist tracks
// Endpoint: GET /api/music/playlist-tracks
// Request: { playlistId: string }
// Response: { tracks: Array<{ id: string, title: string, artist: string, album: string, duration: number, source: 'spotify' | 'youtube' | 'converted', thumbnail: string, url?: string }> }
export const getPlaylistTracks = async (playlistId: string) => {
  try {
    return await api.get('/api/music/playlist-tracks', { params: { playlistId } });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Search for tracks across Spotify and YouTube
// Endpoint: GET /api/music/search
// Request: { query: string, source?: 'spotify' | 'youtube' | 'all' }
// Response: { results: { spotify: Array<Track>, youtube: Array<Track> } }
export const searchTracks = async (query: string, source = 'all') => {
  try {
    return await api.get('/api/music/search', { params: { query, source } });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Import playlist from Spotify or YouTube URL
// Endpoint: POST /api/music/import-playlist
// Request: { url: string, type: 'spotify' | 'youtube' }
// Response: { playlist: { id: string, name: string, tracks: Array<Track>, conversionStatus?: { total: number, converted: number, failed: number } } }
export const importPlaylist = async (url: string, type: 'spotify' | 'youtube') => {
  try {
    return await api.post('/api/music/import-playlist', { url, type });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Update queue order
// Endpoint: PUT /api/music/queue
// Request: { queue: Array<{ id: string, position: number }> }
// Response: { success: boolean }
export const updateQueue = async (queue: Array<{ id: string; position: number }>) => {
  try {
    return await api.put('/api/music/queue', { queue });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Add playlist tracks to queue
// Endpoint: POST /api/music/add-to-queue
// Request: { playlistId: string }
// Response: { success: boolean, addedCount: number }
export const addPlaylistToQueue = async (playlistId: string) => {
  try {
    return await api.post('/api/music/add-to-queue', { playlistId });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Play track
// Endpoint: POST /api/music/play
// Request: { trackId: string }
// Response: { success: boolean }
export const playTrack = async (trackId: string) => {
  try {
    return await api.post('/api/music/play', { trackId });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Pause/Resume playback
// Endpoint: POST /api/music/pause
// Request: {}
// Response: { success: boolean, isPlaying: boolean }
export const togglePlayback = async () => {
  try {
    return await api.post('/api/music/pause');
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Seek to position
// Endpoint: POST /api/music/seek
// Request: { position: number }
// Response: { success: boolean }
export const seekToPosition = async (position: number) => {
  try {
    return await api.post('/api/music/seek', { position });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Set volume
// Endpoint: POST /api/music/volume
// Request: { volume: number }
// Response: { success: boolean }
export const setVolume = async (volume: number) => {
  try {
    return await api.post('/api/music/volume', { volume });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Skip to next track
// Endpoint: POST /api/music/next
// Request: {}
// Response: { success: boolean, track?: Track }
export const skipToNext = async () => {
  try {
    return await api.post('/api/music/next');
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Skip to previous track
// Endpoint: POST /api/music/previous
// Request: {}
// Response: { success: boolean, track?: Track }
export const skipToPrevious = async () => {
  try {
    return await api.post('/api/music/previous');
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Remove track from queue
// Endpoint: DELETE /api/music/queue-track
// Request: { trackId: string }
// Response: { success: boolean }
export const removeFromQueue = async (trackId: string) => {
  try {
    return await api.delete('/api/music/queue-track', { params: { trackId } });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Add track to queue
// Endpoint: POST /api/music/queue-track
// Request: { track: Track }
// Response: { success: boolean }
export const addTrackToQueue = async (track: any) => {
  try {
    return await api.post('/api/music/queue-track', { track });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}