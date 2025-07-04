import api from './api';

// Description: Get Spotify user playlists
// Endpoint: GET /api/spotify/user-playlists
// Request: { userId: string }
// Response: { playlists: Array<{ id: string, name: string, description: string, tracks: { total: number }, images: Array<{ url: string }>, external_urls: { spotify: string } }> }
export const getSpotifyUserPlaylists = async (userId: string) => {
  try {
    return await api.get('/api/spotify/user-playlists', { params: { userId } });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Get Spotify playlist tracks
// Endpoint: GET /api/spotify/playlist-tracks
// Request: { playlistId: string }
// Response: { tracks: Array<{ id: string, name: string, artists: Array<{ name: string }>, album: { name: string, images: Array<{ url: string }> }, duration_ms: number, external_urls: { spotify: string } }> }
export const getSpotifyPlaylistTracks = async (playlistId: string) => {
  try {
    return await api.get('/api/spotify/playlist-tracks', { params: { playlistId } });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Convert Spotify playlist to YouTube
// Endpoint: POST /api/spotify/convert-playlist
// Request: { playlistId: string, playlistName: string, tracks: Array<Track> }
// Response: { convertedPlaylist: { id: string, name: string, tracks: Array<Track>, conversionStats: { total: number, converted: number, failed: number, successRate: number } } }
export const convertSpotifyPlaylist = async (playlistId: string, playlistName: string, tracks: any[]) => {
  try {
    return await api.post('/api/spotify/convert-playlist', { playlistId, playlistName, tracks });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Get Spotify playlist by URL
// Endpoint: GET /api/spotify/playlist-by-url
// Request: { url: string }
// Response: { playlist: { id: string, name: string, description: string, tracks: { total: number }, images: Array<{ url: string }>, external_urls: { spotify: string } } }
export const getSpotifyPlaylistByUrl = async (url: string) => {
  try {
    return await api.get('/api/spotify/playlist-by-url', { params: { url } });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Search Spotify tracks
// Endpoint: GET /api/spotify/search
// Request: { query: string, limit?: number }
// Response: { tracks: Array<Track> }
export const searchSpotifyTracks = async (query: string, limit = 20) => {
  try {
    return await api.get('/api/spotify/search', { params: { query, limit } });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Get Spotify authentication URL
// Endpoint: GET /api/spotify/auth-url
// Request: {}
// Response: { authUrl: string }
export const getSpotifyAuthUrl = async () => {
  try {
    return await api.get('/api/spotify/auth-url');
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Handle Spotify callback
// Endpoint: POST /api/spotify/callback
// Request: { code: string }
// Response: { success: boolean, message: string }
export const handleSpotifyCallback = async (code: string) => {
  try {
    return await api.post('/api/spotify/callback', { code });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}