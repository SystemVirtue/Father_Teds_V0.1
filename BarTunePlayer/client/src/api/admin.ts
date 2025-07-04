import api from './api';

// Description: Get system settings
// Endpoint: GET /api/admin/settings
// Request: {}
// Response: { settings: { displayConfig: object, audioOutput: object, playbackPreferences: object, conversionPreferences: object } }
export const getSystemSettings = async () => {
  try {
    return await api.get('/api/admin/settings');
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Get API connection status
// Endpoint: GET /api/admin/api-status
// Request: {}
// Response: { status: { spotify: { connected: boolean, clientId: string, usage: object }, youtube: { connected: boolean, apiKey: string, usage: object } } }
export const getApiStatus = async () => {
  try {
    return await api.get('/api/admin/api-status');
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Update API configuration
// Endpoint: PUT /api/admin/api-config
// Request: { service: 'spotify' | 'youtube', config: object }
// Response: { success: boolean, message: string }
export const updateApiConfig = async (service: 'spotify' | 'youtube', config: object) => {
  try {
    return await api.put('/api/admin/api-config', { service, config });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Test API connection
// Endpoint: POST /api/admin/test-api
// Request: { service: 'spotify' | 'youtube' }
// Response: { success: boolean, message: string }
export const testApiConnection = async (service: 'spotify' | 'youtube') => {
  try {
    return await api.post('/api/admin/test-api', { service });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Get conversion history
// Endpoint: GET /api/admin/conversion-history
// Request: {}
// Response: { history: Array<{ id: string, playlistName: string, sourceUrl: string, convertedAt: string, status: string, stats: object }> }
export const getConversionHistory = async () => {
  try {
    return await api.get('/api/admin/conversion-history');
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Export library data
// Endpoint: POST /api/admin/export
// Request: { format: 'json' | 'm3u' | 'csv' }
// Response: { success: boolean, downloadUrl: string }
export const exportLibrary = async (format: 'json' | 'm3u' | 'csv') => {
  try {
    return await api.post('/api/admin/export', { format });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Update system settings
// Endpoint: PUT /api/admin/settings
// Request: { settings: object }
// Response: { success: boolean, message: string }
export const updateSystemSettings = async (settings: object) => {
  try {
    return await api.put('/api/admin/settings', { settings });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Backup library
// Endpoint: POST /api/admin/backup
// Request: {}
// Response: { success: boolean, downloadUrl: string }
export const backupLibrary = async () => {
  try {
    return await api.post('/api/admin/backup');
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Restore library
// Endpoint: POST /api/admin/restore
// Request: { backupFile: File }
// Response: { success: boolean, message: string }
export const restoreLibrary = async (backupFile: File) => {
  try {
    const formData = new FormData();
    formData.append('backupFile', backupFile);
    return await api.post('/api/admin/restore', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Sync with GitHub
// Endpoint: POST /api/admin/github-sync
// Request: { token: string, repository: string }
// Response: { success: boolean, message: string }
export const syncWithGitHub = async (token: string, repository: string) => {
  try {
    return await api.post('/api/admin/github-sync', { token, repository });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Re-convert playlist
// Endpoint: POST /api/admin/reconvert-playlist
// Request: { historyId: string }
// Response: { success: boolean, message: string }
export const reconvertPlaylist = async (historyId: string) => {
  try {
    return await api.post('/api/admin/reconvert-playlist', { historyId });
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}