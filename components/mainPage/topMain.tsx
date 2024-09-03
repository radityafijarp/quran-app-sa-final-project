import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Repeat } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react";

interface topMainPageProps {
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;

    repetitionMethod: string;
    currentPage: string;
    currentSurah: string;
    currentAyah: string;
    ayahRepetition: number;
    rangeRepetition: number;
    repetitionCount: number;
    selectedQori: string;
    selectedSubFolder: string;
    currentSurahNumber:string
}

const TopMain: React.FC<topMainPageProps> = ({
    repetitionMethod,
    currentPage,
    currentSurah,
    currentAyah,
    isPlaying,
    setIsPlaying,
    ayahRepetition,
    rangeRepetition,
    repetitionCount,
    selectedQori,
    selectedSubFolder,
    currentSurahNumber
}) => {
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audioUrl = `https://everyayah.com/data/${selectedSubFolder}/${currentSurahNumber.padStart(3, '0')}${currentAyah.padStart(3, '0')}.mp3`;
        console.log("Audio URL:", audioUrl);  // Log the URL to verify
        const newAudio = new Audio(audioUrl);
    
        setAudio(newAudio);
    
        return () => {
            newAudio.pause();
            newAudio.src = "";
            setAudio(null);
        };
    }, [selectedSubFolder, currentSurah, currentAyah]);
    

    const togglePlayPause = () => {
        if (audio) {
            if (isPlaying) {
                audio.pause();
                console.log
            } else {
                audio.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>
                    {repetitionMethod === 'page' || repetitionMethod === 'juz' ? (
                        `Now Playing: Page ${currentPage}`
                    ) : (
                        `Now Playing: Surah ${currentSurah}, Ayah ${currentAyah}`
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4">Qari: {selectedQori}</p>
                <div className="flex justify-center items-center space-x-4">
                    <Button variant="outline" size="icon">
                        <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button onClick={togglePlayPause} size="icon">
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="icon">
                        <SkipForward className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center space-x-2">
                        <Repeat className="h-4 w-4" />
                        <span className="font-bold">
                            {repetitionMethod === 'custom'
                                ? `${ayahRepetition}x per Ayah, ${rangeRepetition}x per Range`
                                : `${repetitionCount}x`}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default TopMain;
