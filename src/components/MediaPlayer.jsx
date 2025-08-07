import { useRef, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { setPlaying, setCurrentTime } from "../../store/mediaSlice"
import { formatTime } from "../../utils/mediaUtils"

export default function MediaPlayer({ file }) {
  const dispatch = useDispatch()
  
  // Get player state from Redux
  const isPlaying = useSelector((state) => state.media.isPlaying)
  const currentTime = useSelector((state) => state.media.currentTime)
  
  // Local state for volume controls
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  
  // Reference to the media element
  const mediaRef = useRef(null)
  
  // Track if we're currently seeking to avoid feedback loops
  const isSeekingRef = useRef(false)

  // Sync media element with Redux playing state
  useEffect(() => {
    const media = mediaRef.current
    if (!media) return

    if (isPlaying) {
      media.play()
    } else {
      media.pause()
    }
  }, [isPlaying])

  // Sync media element current time with Redux (only when seeking, not during playback)
  useEffect(() => {
    const media = mediaRef.current
    if (!media || isSeekingRef.current) return

    // Only sync if there's a significant difference (indicating a seek operation)
    const timeDifference = Math.abs(media.currentTime - currentTime)
    if (timeDifference > 0.5) {
      // Keep time within trim bounds
      const clampedTime = Math.max(file.startTime, Math.min(currentTime, file.endTime))
      media.currentTime = clampedTime
    }
  }, [currentTime, file.startTime, file.endTime])

  const handleTimeUpdate = () => {
    const media = mediaRef.current
    if (!media) return

    const time = media.currentTime

    const TOLERANCE = 0.1

    if (time >= (file.endTime - TOLERANCE)) {
      dispatch(setPlaying(false))
      dispatch(setCurrentTime(file.endTime))
      media.currentTime = file.endTime
      return
    }

    if (time < file.startTime) {
      media.currentTime = file.startTime
      return
    }

    isSeekingRef.current = true
    
    dispatch(setCurrentTime(time))
    
    setTimeout(() => {
      isSeekingRef.current = false
    }, 10)
  }

  const handlePlay = () => dispatch(setPlaying(true))
  const handlePause = () => dispatch(setPlaying(false))

  const togglePlayPause = () => {
    dispatch(setPlaying(!isPlaying))
  }

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value)
    
    isSeekingRef.current = false
    
    dispatch(setCurrentTime(time))
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    
    if (mediaRef.current) {
      mediaRef.current.volume = newVolume
    }
    
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    
    if (mediaRef.current) {
      mediaRef.current.volume = newMuted ? 0 : volume
    }
  }

  const trimmedDuration = file.endTime - file.startTime

  return (
    <div className="space-y-4">
      {/* Media Display Area */}
      <div className="rounded-lg overflow-hidden aspect-video flex items-center justify-center">
        {file.type === "video" ? (
          <video
            ref={mediaRef}
            src={file.url}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onPlay={handlePlay}
            onPause={handlePause}
            onLoadedMetadata={() => {
              if (mediaRef.current) {
                mediaRef.current.currentTime = file.startTime
                mediaRef.current.volume = volume
              }
            }}
          />
        ) : file.type === "audio" ? (
          // Audio Visualization
          <div className="flex items-center justify-center w-full h-full">
            <div className="text-center">
              <Volume2 className="h-16 w-16 mx-auto mb-4 opacity-75" />
              <p className="text-lg font-medium">{file.name}</p>
              <p className="text-sm opacity-75">Audio File</p>
            </div>
            <audio
              ref={mediaRef}
              src={file.url}
              onTimeUpdate={handleTimeUpdate}
              onPlay={handlePlay}
              onPause={handlePause}
              onLoadedMetadata={() => {
                if (mediaRef.current) {
                  mediaRef.current.currentTime = file.startTime
                  mediaRef.current.volume = volume
                }
              }}
            />
          </div>
        ) : (
          // Image Display
          <img 
            src={file.url || "/placeholder.svg"} 
            alt={file.name} 
            className="max-w-full max-h-full object-contain" 
          />
        )}
      </div>

      {file.type !== "image" && (
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="space-y-2">
            <input
              type="range"
              min={file.startTime}
              max={file.endTime}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              aria-label="Seek"
            />
            <div className="flex justify-between text-xs">
              <span>{formatTime(currentTime - file.startTime)}</span>
              <span>{formatTime(trimmedDuration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlayPause}
                className="flex items-center justify-center w-10 h-10 bg-accent-foreground text-primary rounded-full transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </button>

              {/* Volume Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-accent-foreground rounded-full transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5 text-primary" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-primary" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  aria-label="Volume"
                />
              </div>
            </div>

            <div className="text-sm text-gray-600">
              {formatTime(currentTime)} / {formatTime(file.duration)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
