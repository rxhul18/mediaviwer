import { useSelector, useDispatch } from "react-redux"
import { setActiveFile, removeMediaFile } from "../../store/mediaSlice"
import { Play, Trash2, ImageIcon, Music, Video } from 'lucide-react'
import { formatTime } from "../../utils/mediaUtils"

export default function Timeline() {
  const dispatch = useDispatch()

  const files = useSelector((state) => state.media.files)
  const activeFileId = useSelector((state) => state.media.activeFileId)
  const timelineScale = useSelector((state) => state.media.timelineScale)

  const getFileIcon = (type) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "audio":
        return <Music className="h-4 w-4" />
      case "image":
        return <ImageIcon className="h-4 w-4" />
      default:
        return <ImageIcon className="h-4 w-4" />
    }
  }

  const getFileColor = (type) => {
    switch (type) {
      case "video":
        return "bg-blue-100 border-blue-300 text-primary-800"
      case "audio":
        return "bg-green-100 border-green-300 text-green-800"
      case "image":
        return "bg-purple-100 border-purple-300 text-purple-800"
      default:
        return "bg-gray-100 border-gray-300 text-gray-800"
    }
  }

  const selectFile = (fileId) => {
    dispatch(setActiveFile(fileId))
  }

  const deleteFile = (fileId, e) => {
    e.preventDefault()
    dispatch(removeMediaFile(fileId))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-primary">
        <span>Timeline Scale: {timelineScale}px = 1s</span>
        <span>{files.length} files</span>
      </div>

      <div className="relative">
        <div className="overflow-x-auto pb-4">
          <div className="flex items-start gap-2 min-w-max p-4 bg-card-foreground/75 rounded-lg">
            {files.map((file) => {
              const trimmedDuration = file.endTime - file.startTime
              const blockWidth = Math.max(trimmedDuration * timelineScale, 120)
              const isActive = file.id === activeFileId

              return (
                <div
                  key={file.id}
                  className={`relative group cursor-pointer transition-all duration-200`}
                  style={{ width: `${blockWidth}px` }}
                  onClick={() => selectFile(file.id)}
                >
                 
                  <div
                    className={`
                      border-2 rounded-lg p-3 h-24 flex flex-col justify-between
                      hover:shadow-md transition-shadow
                      ${getFileColor(file.type)}
                      ${isActive ? "ring-2 ring-blue-400" : ""}
                    `}
                  >
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {getFileIcon(file.type)}
                        <span className="text-xs font-medium truncate">
                          {file.type.toUpperCase()}
                        </span>
                      </div>
                      
                      <button
                        className="opacity-0 z-30 group-hover:opacity-100 p-1 hover:bg-destructive-foreground rounded transition-all"
                        onClick={(e) => deleteFile(file.id, e)}
                      >
                        <Trash2 className="size-3 text-destructive" />
                      </button>
                    </div>

                    {/* File Info */}
                    <div className="space-y-1">
                      <p className="text-xs font-medium truncate" title={file.name}>
                        {file.name}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span>{formatTime(trimmedDuration)}</span>
                        {isActive && <Play className="h-3 w-3 text-primary-600" />}
                      </div>
                    </div>

                    {/* Video thumbnail background */}
                    {file.thumbnail && (
                      <div className="absolute inset-0 rounded-lg overflow-hidden opacity-70">
                        <img 
                          src={file.thumbnail} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                  </div>

                  {(file.startTime > 0 || file.endTime < file.duration) && (
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-full" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {files.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No media files uploaded yet</p>
          <p className="text-sm">Upload some files to see them on the timeline</p>
        </div>
      )}
    </div>
  )
}
