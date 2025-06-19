/**
 * Audio utilities for handling voice recordings in campaigns
 */

export interface AudioConversionOptions {
  targetFormat?: 'mp3' | 'wav' | 'ogg'
  bitRate?: number
  sampleRate?: number
}

export interface AudioMetadata {
  duration: number
  size: number
  format: string
  bitRate?: number
  sampleRate?: number
}

/**
 * Get metadata from an audio blob
 */
export function getAudioMetadata(audioBlob: Blob): Promise<AudioMetadata> {
  return new Promise((resolve, reject) => {
    const audio = new Audio()
    const url = URL.createObjectURL(audioBlob)
    
    audio.onloadedmetadata = () => {
      const metadata: AudioMetadata = {
        duration: audio.duration,
        size: audioBlob.size,
        format: audioBlob.type,
      }
      
      URL.revokeObjectURL(url)
      resolve(metadata)
    }
    
    audio.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load audio metadata'))
    }
    
    audio.src = url
  })
}

/**
 * Convert audio blob to base64 for API transmission
 */
export function audioToBase64(audioBlob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      const result = reader.result as string
      // Remove the data URL prefix to get just the base64 data
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to convert audio to base64'))
    }
    
    reader.readAsDataURL(audioBlob)
  })
}

/**
 * Create a download URL for an audio blob
 */
export function createDownloadUrl(audioBlob: Blob): { url: string; cleanup: () => void } {
  const url = URL.createObjectURL(audioBlob)
  
  return {
    url,
    cleanup: () => URL.revokeObjectURL(url)
  }
}

/**
 * Validate audio file constraints for voicemail campaigns
 */
export interface AudioValidationResult {
  isValid: boolean
  errors: string[]
  metadata?: AudioMetadata
}

export async function validateAudioFile(
  audioBlob: Blob, 
  maxDuration: number = 30,
  maxSize: number = 10 * 1024 * 1024 // 10MB
): Promise<AudioValidationResult> {
  const result: AudioValidationResult = {
    isValid: true,
    errors: []
  }

  try {
    // Check file size
    if (audioBlob.size > maxSize) {
      result.errors.push(`File size (${(audioBlob.size / 1024 / 1024).toFixed(1)}MB) exceeds maximum allowed size (${maxSize / 1024 / 1024}MB)`)
    }

    // Check file type
    if (!audioBlob.type.startsWith('audio/')) {
      result.errors.push('File must be an audio file')
    }

    // Get metadata and check duration
    const metadata = await getAudioMetadata(audioBlob)
    result.metadata = metadata

    if (metadata.duration > maxDuration) {
      result.errors.push(`Audio duration (${metadata.duration.toFixed(1)}s) exceeds maximum allowed duration (${maxDuration}s)`)
    }

    if (metadata.duration < 1) {
      result.errors.push('Audio must be at least 1 second long')
    }

    result.isValid = result.errors.length === 0

  } catch (error) {
    result.errors.push('Failed to validate audio file: ' + (error instanceof Error ? error.message : 'Unknown error'))
    result.isValid = false
  }

  return result
}

/**
 * Format duration in seconds to MM:SS
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/**
 * Check if the browser supports audio recording
 */
export function supportsAudioRecording(): boolean {
  return !!(
    typeof navigator !== 'undefined' && 
    navigator.mediaDevices && 
    typeof navigator.mediaDevices.getUserMedia === 'function' && 
    typeof window !== 'undefined' && 
    window.MediaRecorder
  )
}

/**
 * Get supported audio MIME types for recording
 */
export function getSupportedMimeTypes(): string[] {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/wav'
  ]
  
  return types.filter(type => MediaRecorder.isTypeSupported(type))
}

/**
 * Get the best supported MIME type for audio recording
 */
export function getBestMimeType(): string {
  const supported = getSupportedMimeTypes()
  
  // Prefer webm with opus codec for best compression and quality
  if (supported.includes('audio/webm;codecs=opus')) {
    return 'audio/webm;codecs=opus'
  }
  
  // Fallback to webm without codec specification
  if (supported.includes('audio/webm')) {
    return 'audio/webm'
  }
  
  // Last resort
  return supported[0] || 'audio/wav'
}
