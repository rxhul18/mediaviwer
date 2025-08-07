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
    if (type === "image") {
      resolve(0)
      return
    }

    const url = URL.createObjectURL(file)
    
    const element = type === "video" 
      ? document.createElement("video") 
      : document.createElement("audio")

    element.addEventListener("loadedmetadata", () => {
      const duration = element.duration || 0
      resolve(duration)
      URL.revokeObjectURL(url)
    })

    element.addEventListener("error", () => {
      console.log("Could not load media file")
      resolve(0)
      URL.revokeObjectURL(url)
    })

    element.src = url
  })
}

// Create thumbnail for video files
export const createThumbnail = async (file) => {
  const video = document.createElement("video")
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  
  if (!ctx) throw new Error("Could not get canvas context")
  
  const url = URL.createObjectURL(file)
  video.src = url

  try {
    await new Promise(resolve => video.addEventListener("loadedmetadata", resolve))
    
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    video.currentTime = Math.min(1, video.duration / 4)
    
    await new Promise(resolve => video.addEventListener("seeked", resolve))
    
    ctx.drawImage(video, 0, 0)
    const thumbnail = canvas.toDataURL("image/jpeg", 0.8)
    
    return thumbnail
  } catch (error) {
    throw new Error("Could not create thumbnail")
  } finally {
    URL.revokeObjectURL(url)
  }
}

// Format seconds into readable time string
export const formatTime = (seconds) => {
  if (!isFinite(seconds) || seconds < 0) return "0:00"

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)


  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return `${minutes}:${secs.toString().padStart(2, "0")}`
}
