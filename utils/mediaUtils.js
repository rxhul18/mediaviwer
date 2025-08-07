// Determine media type from file
export const getMediaType = (file) => {
  // Check MIME type first
  if (file.type.startsWith("video/")) return "video"
  if (file.type.startsWith("audio/")) return "audio"
  if (file.type.startsWith("image/")) return "image"

  // Fallback to file extension
  const extension = file.name.split(".").pop()?.toLowerCase()
  if (["mp4", "webm"].includes(extension)) return "video"
  if (["mp3", "wav"].includes(extension)) return "audio"
  return "image"
}

// Get duration of media file
export const getMediaDuration = (file, type) => {
  return new Promise((resolve) => {
    // Images have no duration
    if (type === "image") {
      resolve(0)
      return
    }

    // Create temporary URL for the file
    const url = URL.createObjectURL(file)
    
    // Create appropriate media element
    const element = type === "video" 
      ? document.createElement("video") 
      : document.createElement("audio")

    // When metadata loads, get duration
    element.addEventListener("loadedmetadata", () => {
      const duration = element.duration || 0
      resolve(duration)
      URL.revokeObjectURL(url) // Clean up
    })

    // Handle errors
    element.addEventListener("error", () => {
      console.log("Could not load media file")
      resolve(0)
      URL.revokeObjectURL(url) // Clean up
    })

    element.src = url
  })
}

// Create thumbnail for video files
export const createThumbnail = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      reject(new Error("Could not get canvas context"))
      return
    }

    // When video metadata loads
    video.addEventListener("loadedmetadata", () => {
      // Set canvas size to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Seek to 1 second or 25% through video
      video.currentTime = Math.min(1, video.duration / 4)
    })

    // When seeking is complete
    video.addEventListener("seeked", () => {
      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0)
      
      // Convert canvas to image data
      const thumbnail = canvas.toDataURL("image/jpeg", 0.8)
      resolve(thumbnail)
      
      // Clean up
      URL.revokeObjectURL(video.src)
    })

    // Handle errors
    video.addEventListener("error", () => {
      reject(new Error("Could not load video"))
      URL.revokeObjectURL(video.src)
    })

    // Start loading video
    video.src = URL.createObjectURL(file)
  })
}

// Format seconds into readable time string
export const formatTime = (seconds) => {
  // Handle invalid input
  if (!isFinite(seconds) || seconds < 0) return "0:00"

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  // Include hours if needed
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Just minutes and seconds
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}
