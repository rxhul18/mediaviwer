import { useCallback, useState } from "react"
import { useDispatch } from "react-redux"
import { Upload, AlertCircle } from 'lucide-react'
import { addMediaFile } from "../../store/mediaSlice"
import { getMediaDuration, getMediaType, createThumbnail } from "../../utils/mediaUtils"

// Supported file formats
const SUPPORTED_FORMATS = {
  video: [".mp4", ".webm"],
  audio: [".mp3", ".wav"],
  image: [".jpg", ".jpeg", ".png", ".gif"],
}

export default function MediaUpload() {
  const dispatch = useDispatch()
  const [error, setError] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  // Check if uploaded file is valid
  const validateFile = (file) => {
    const extension = "." + file.name.split(".").pop()?.toLowerCase()
    const allSupported = [
      ...SUPPORTED_FORMATS.video, 
      ...SUPPORTED_FORMATS.audio, 
      ...SUPPORTED_FORMATS.image
    ]

    // Check file extension
    if (!allSupported.includes(extension)) {
      return `Unsupported file format. Supported: ${allSupported.join(", ")}`
    }

    // Check file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      return "File size must be less than 100MB"
    }

    return null // No error
  }

  // Process uploaded files
  const handleFileUpload = useCallback(async (files) => {
    setError(null)
    setIsUploading(true)

    try {
      // Process each file
      for (const file of Array.from(files)) {
        // Validate the file first
        const validationError = validateFile(file)
        if (validationError) {
          setError(validationError)
          continue
        }

        // Create object URL for the file
        const url = URL.createObjectURL(file)
        const type = getMediaType(file)
        const duration = await getMediaDuration(file, type)

        // Create thumbnail for videos
        let thumbnail = null
        if (type === "video") {
          try {
            thumbnail = await createThumbnail(file)
          } catch (err) {
            console.log("Could not create thumbnail:", err)
          }
        }

        // Create media file object
        const mediaFile = {
          id: crypto.randomUUID(), // Generate unique ID
          file,
          name: file.name,
          type,
          duration,
          url,
          startTime: 0, // Default start time
          endTime: duration, // Default end time (full duration)
          thumbnail,
        }

        // Add to Redux store
        dispatch(addMediaFile(mediaFile))
      }
    } catch (err) {
      console.error("Upload error:", err)
      setError("Failed to process media file")
    } finally {
      setIsUploading(false)
    }
  }, [dispatch])

  // Handle drag and drop
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }, [handleFileUpload])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
  }, [])

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          {isUploading ? "Processing files..." : "Drop files here or click to upload"}
        </p>
        <p className="text-sm text-gray-500">
          Supports: MP4, WebM, MP3, WAV, JPG, PNG, GIF
        </p>
        
        {/* Hidden file input */}
        <input
          id="file-input"
          type="file"
          multiple
          accept=".mp4,.webm,.mp3,.wav,.jpg,.jpeg,.png,.gif"
          className="hidden"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          disabled={isUploading}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  )
}
