import { Github, TvMinimalPlay, Twitter } from 'lucide-react'

function Footer() {
    return (
        <footer className='flex justify-center h-16 border-t px-6 bg-background sticky bottom-0'>
            <div className='container flex justify-between items-center'>
                <div className='flex items-center gap-4'>
                    <TvMinimalPlay className='size-6 stroke-[1.5px]' />
                    <p className='text-base pl-3 border-l border-border text-muted-foreground font-normal'>
                        Built with <span className='text-red-500'>❤️</span> by <a href={"https://github.com/rxhul18"} className='underline font-semibold'>Rahul Shah</a>
                    </p>
                </div>

                <div className='flex items-center gap-2'>
                    <a
                        href="https://github.com/rxhul18/InterviewScheduler"
                        target="_blank"
                        rel="noopener noreferrer"
                        className='text-muted-foreground hover:text-foreground transition-colors border p-1 rounded-lg'
                    >
                        <Github className='size-5' />
                    </a>
                    <a
                        href="https://x.com/mindpuzzledev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className='text-muted-foreground hover:text-foreground transition-colors border p-1 rounded-lg'
                    >
                        <Twitter className='size-5' />
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer