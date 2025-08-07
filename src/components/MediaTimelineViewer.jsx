import { useSelector } from "react-redux";
import MediaUpload from "./MediaUpload";
import Timeline from "./Timeline";
import MediaPlayer from "./MediaPlayer";
import TrimControls from "./TrimControls";
import { AnimateSvg } from "./custom/AnimateArrow";

export default function MediaTimelineViewer() {
  // Get data from Redux store
  const files = useSelector((state) => state.media.files);
  const activeFileId = useSelector((state) => state.media.activeFileId);

  // Find the currently active file
  const activeFile = files.find((f) => f.id === activeFileId);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* File Upload Section */}
      <div className="bg-card rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">
          Upload Media
        </h2>
        <MediaUpload />
      </div>
      {files.length === 0 && (
        <div className="flex flex-col items-center justify-center relative">
          <h1 className="text-4xl font-bold">Try Now</h1>
          <AnimateSvg
            width="100%"
            height="100%"
            viewBox="0 0 355 162"
            className="my-svg-animation absolute -top-10 left-15 -rotate-45 size-64 stroke-gray-900 dark:stroke-white"
            path="M3 153.9C19.7648 151.422 58.3853 148.645 58.3853 123.767C58.3853 109.758 41.9931 109.583 35.4673 119.947C29.8677 128.841 29.3802 151.014 41.6212 155.385C68.0833 164.836 96.3337 155.089 121.41 146.367C158.021 133.632 195.283 106.274 215.841 72.7318C223.827 59.7017 248.721 3.98332 214.143 3.02276C159.312 1.49957 148.663 76.8016 170.111 114.748C179.098 130.649 200.663 140.818 217.963 143.29C237.073 146.02 266.527 131.63 270.271 111.035C273.351 94.0976 254.758 100.754 250.43 111.884C244.084 128.203 258.692 140.196 273.773 140.531C298.453 141.08 318.113 127.233 334.463 109.974C339.288 104.881 348.912 91.2687 350.484 84.1909C351.915 77.7539 351.661 81.7626 350.697 86.1007C349.794 90.1648 352.5 94.2726 352.5 98.5146C352.5 100.006 350.591 90.7585 350.591 88.0105C350.591 74.942 333.087 85.5908 325.763 87.0556"
            // strokeColor="#000000"
            strokeWidth={3}
            strokeLinecap="round"
            initialAnimation={true}
            animationDuration={1.5}
            animationDelay={0}
            animationBounce={0.3}
            reverseAnimation={false}
            enableHoverAnimation={false}
            hoverAnimationType="redraw"
            hoverStrokeColor="#4f46e5"
          />
        </div>
      )}

      {/* Media Player Section - Only show if file is selected */}
      {activeFile && (
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MediaPlayer file={activeFile} />
            </div>
            <div>
              <TrimControls file={activeFile} />
            </div>
          </div>
        </div>
      )}

      {/* Timeline Section - Only show if files exist */}
      {files.length > 0 && (
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-2">Timeline</h2>
          <Timeline />
        </div>
      )}
    </div>
  );
}
