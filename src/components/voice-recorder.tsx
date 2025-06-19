'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Upload,
  Timer,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void
  onRecordingDelete: () => void
  existingRecording?: Blob | null
  maxDuration?: number // in seconds, default 30
}

export function VoiceRecorder({ 
  onRecordingComplete, 
  onRecordingDelete, 
  existingRecording,
  maxDuration = 30 
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(existingRecording || null)
  const [error, setError] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize audio element when recording exists
  useEffect(() => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob)
      if (audioRef.current) {
        audioRef.current.src = audioUrl
      } else {
        audioRef.current = new Audio(audioUrl)
      }
      
      audioRef.current.onended = () => {
        setIsPlaying(false)
        setPlaybackTime(0)
        if (playbackTimerRef.current) {
          clearInterval(playbackTimerRef.current)
        }
      }

      return () => {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioBlob])

  // Recording timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          const newDuration = prev + 1
          if (newDuration >= maxDuration) {
            stopRecording()
          }
          return newDuration
        })
      }, 1000)
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
  }, [isRecording, isPaused, maxDuration])

  // Playback timer
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      playbackTimerRef.current = setInterval(() => {
        if (audioRef.current) {
          setPlaybackTime(audioRef.current.currentTime)
        }
      }, 100)
    } else {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current)
      }
    }

    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current)
      }
    }
  }, [isPlaying])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const startRecording = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      audioChunksRef.current = []
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' })
        setAudioBlob(blob)
        onRecordingComplete(blob, recordingDuration)
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorderRef.current.start(100) // Collect data every 100ms
      setIsRecording(true)
      setIsPaused(false)
      setRecordingDuration(0)
    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Unable to access microphone. Please check permissions.')
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
    }
  }

  const playRecording = () => {
    if (audioRef.current && audioBlob) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const resetRecording = () => {
    if (isRecording) {
      stopRecording()
    }
    if (isPlaying) {
      pausePlayback()
    }
    
    setAudioBlob(null)
    setRecordingDuration(0)
    setPlaybackTime(0)
    onRecordingDelete()
  }

  const downloadRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `voicemail-recording-${Date.now()}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      setAudioBlob(file)
      
      // Get duration
      const audio = new Audio()
      audio.onloadedmetadata = () => {
        setRecordingDuration(audio.duration)
        onRecordingComplete(file, audio.duration)
      }
      audio.src = URL.createObjectURL(file)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-red-500" />
          Voice Recording
        </CardTitle>
        <CardDescription>
          Record your own voicemail message or upload an audio file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
          >
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}

        {/* Recording Controls */}
        <div className="text-center space-y-4">
          {!audioBlob ? (
            <div className="space-y-4">
              {/* Recording Button */}
              <div className="flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    onClick={isRecording ? (isPaused ? resumeRecording : pauseRecording) : startRecording}
                    className={`w-24 h-24 rounded-full ${
                      isRecording 
                        ? (isPaused ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600')
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {isRecording ? (
                      isPaused ? <Play className="h-8 w-8" /> : <Pause className="h-8 w-8" />
                    ) : (
                      <Mic className="h-8 w-8" />
                    )}
                  </Button>
                </motion.div>
              </div>

              {/* Recording Status */}
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}></div>
                    <span className="text-sm font-medium">
                      {isPaused ? 'Paused' : 'Recording'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <Timer className="h-4 w-4 text-gray-500" />
                    <span className="text-lg font-mono">
                      {formatTime(recordingDuration)} / {formatTime(maxDuration)}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((recordingDuration / maxDuration) * 100, 100)}%` }}
                    />
                  </div>

                  <Button
                    onClick={stopRecording}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Square className="h-4 w-4" />
                    Stop Recording
                  </Button>
                </motion.div>
              )}

              {/* Instructions */}
              {!isRecording && (
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Click the microphone to start recording your voicemail message
                  </p>
                  <Badge variant="outline" className="text-xs">
                    Maximum {maxDuration} seconds
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            /* Playback Controls */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Recording Complete</span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <Timer className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    Duration: {formatTime(recordingDuration)}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <Button
                    onClick={isPlaying ? pausePlayback : playRecording}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>

                  <Button
                    onClick={resetRecording}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Re-record
                  </Button>

                  <Button
                    onClick={downloadRecording}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>

                {isPlaying && (
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full transition-all duration-200"
                      style={{ width: `${Math.min((playbackTime / recordingDuration) * 100, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* File Upload Option */}
          <div className="border-t pt-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">Or upload an existing audio file</p>
              <div className="flex justify-center">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Audio File
                  </Button>
                </label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
