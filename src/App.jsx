import { Provider } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MediaTimelineViewer from "@/components/MediaTimelineViewer";
import { store } from "../store/store";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import Footer from "./components/custom/Footer";
import { TvMinimalPlay } from "lucide-react";

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="min-h-screen bg-[linear-gradient(to_right,#00000008_0.5px,transparent_1px),linear-gradient(to_bottom,#0000000a_0.5px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(to_right,#ffffff1a_0.5px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)]">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center ml-[2.5%] w-[95%] mb-7 sticky top-5 bg-background/5 backdrop-blur-2xl border border-border z-10 rounded-lg p-4 shadow-md">
              <div className="flex items-center gap-3">
                <TvMinimalPlay className="size-7"/>
                <h1 className="text-4xl font-bold text-primary">
                  Mini Media Timeline Viewer
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <ModeToggle />
                <Avatar className={"size-9 cursor-pointer"}>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <MediaTimelineViewer />
          </div>
        </div>
        <Footer />
      </ThemeProvider>
    </Provider>
  );
}
