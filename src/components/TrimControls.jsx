import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Scissors, RotateCcw } from 'lucide-react'
import { updateTrimTimes } from "../../store/mediaSlice"
import { formatTime } from "../../utils/mediaUtils"

export default function TrimControls({ file }) {
  const dispatch = useDispatch()
  
  const [startTime, setStartTime] = useState(file.startTime.toString())
  const [endTime, setEndTime] = useState(file.endTime.toString())
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setStartTime(file.startTime.toString())
    setEndTime(file.endTime.toString())
    setErrors({})
  }, [file.id, file.startTime, file.endTime])

  const validateTimes = (start, end) => {
    const newErrors = {}
    const startNum = parseFloat(start)
    const endNum = parseFloat(end)

    if (isNaN(startNum) || startNum < 0) {
      newErrors.start = "Start time must be >= 0"
    } else if (startNum >= file.duration) {
      newErrors.start = "Start time must be < duration"
    }

    if (isNaN(endNum) || endNum > file.duration) {
      newErrors.end = `End time must be <= ${formatTime(file.duration)}`
    } else if (endNum <= startNum) {
      newErrors.end = "End time must be > start time"
    }

    return newErrors
  }

  const handleStartTimeChange = (value) => {
    setStartTime(value)
    const newErrors = validateTimes(value, endTime)
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      dispatch(updateTrimTimes({
        id: file.id,
        startTime: parseFloat(value),
        endTime: parseFloat(endTime),
      }))
    }
  }

  const handleEndTimeChange = (value) => {
    setEndTime(value)
    const newErrors = validateTimes(startTime, value)
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      dispatch(updateTrimTimes({
        id: file.id,
        startTime: parseFloat(startTime),
        endTime: parseFloat(value),
      }))
    }
  }


  const resetTrim = () => {
    setStartTime("0")
    setEndTime(file.duration.toString())
    setErrors({})
    
    dispatch(updateTrimTimes({
      id: file.id,
      startTime: 0,
      endTime: file.duration,
    }))
  }

  const isTrimmable = file.type === "video" || file.type === "audio"
  const hasErrors = Object.keys(errors).length > 0
  const trimmedDuration = parseFloat(endTime) - parseFloat(startTime)

  if (!isTrimmable) {
    return (
      <div className="bg-accent-foreground rounded-lg p-4">
        <div className="flex items-center gap-2 text-gray-500">
          <Scissors className="h-5 w-5" />
          <span className="font-medium">Trimming not available</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Trimming is only available for video and audio files
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scissors className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Trim Controls</h3>
        </div>
        <button
          onClick={resetTrim}
          className="flex items-center gap-1 px-2 py-1 text-sm text-primary hover:bg-accent-foreground/50 rounded transition-colors"
          aria-label="Reset trim"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <div className="space-y-4">
        {/* Start Time Input */}
        <div>
          <label htmlFor="start-time" className="block text-sm font-medium mb-1">
            Start Time (seconds)
          </label>
          <input
            id="start-time"
            type="number"
            min={0}
            max={file.duration}
            step={0.1}
            value={startTime}
            onChange={(e) => handleStartTimeChange(e.target.value)}
            className={`
              w-full px-3 py-2 border rounded-md text-sm
              ${errors.start
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }
              focus:outline-none focus:ring-1
            `}
          />
          {errors.start && (
            <p className="mt-1 text-xs text-red-600">{errors.start}</p>
          )}
        </div>

        {/* End Time Input */}
        <div>
          <label htmlFor="end-time" className="block text-sm font-medium mb-1">
            End Time (seconds)
          </label>
          <input
            id="end-time"
            type="number"
            min={0}
            max={file.duration}
            step={0.1}
            value={endTime}
            onChange={(e) => handleEndTimeChange(e.target.value)}
            className={`
              w-full px-3 py-2 border rounded-md text-sm
              ${errors.end
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }
              focus:outline-none focus:ring-1
            `}
          />
          {errors.end && (
            <p className="mt-1 text-xs text-red-600">{errors.end}</p>
          )}
        </div>


        <div className="bg-accent-foreground/10 rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="">Original Duration:</span>
            <span className="font-medium">{formatTime(file.duration)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Trimmed Duration:</span>
            <span className={`font-medium ${hasErrors ? "text-red-600" : "text-blue-600"}`}>
              {hasErrors ? "Invalid" : formatTime(trimmedDuration)}
            </span>
          </div>
          {!hasErrors && trimmedDuration !== file.duration && (
            <div className="text-xs">
              ✂️ Trimmed by {formatTime(file.duration - trimmedDuration)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
