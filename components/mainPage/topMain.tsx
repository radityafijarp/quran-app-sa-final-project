import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Repeat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    currentSurahNumber: string;
    endPage: string;
    currentJuz: string;
    endSurahNumber: string;

    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
    setAyahRepetition: React.Dispatch<React.SetStateAction<number>>;
    setRangeRepetition: React.Dispatch<React.SetStateAction<number>>;
    setRepetitionCount: React.Dispatch<React.SetStateAction<number>>;
    setCurrentSurah: React.Dispatch<React.SetStateAction<string>>;
    setCurrentAyah: React.Dispatch<React.SetStateAction<string>>;
    setCurrentSurahNumber: React.Dispatch<React.SetStateAction<string>>;
    setCurrentJuz: React.Dispatch<React.SetStateAction<string>>;
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
    currentSurahNumber,
    setCurrentPage,
    endPage,
    setAyahRepetition,
    setRangeRepetition,
    setRepetitionCount,
    setCurrentAyah,
    setCurrentSurah,
    setCurrentSurahNumber,
    endSurahNumber,
    setCurrentJuz,
    currentJuz
}) => {
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    useEffect(() => {
        let audioUrl = "";

        if (repetitionMethod === 'page' || repetitionMethod === 'juz') {
            audioUrl = `https://everyayah.com/data/${selectedSubFolder}/PageMp3s/Page${currentPage.padStart(3, '0')}.mp3`;
        } else {
            audioUrl = `https://everyayah.com/data/${selectedSubFolder}/${currentSurahNumber.padStart(3, '0')}${currentAyah.padStart(3, '0')}.mp3`;
        }

        console.log("Audio URL:", audioUrl);
        const newAudio = new Audio(audioUrl);

        setAudio(newAudio);

        return () => {
            newAudio.pause();
            newAudio.src = "";
            setAudio(null);
        };
    }, [selectedSubFolder, currentSurah, currentAyah, currentPage, repetitionMethod, currentSurahNumber]);

    const playAudio = async (url: string) => {
        return new Promise<void>((resolve) => {
            const audio = new Audio(url);
            audio.play();
            audio.onended = () => resolve();
        });
    };

    const handlePageRepetition = async () => {
        const initialRepetition = repetitionCount;
        const initialPage=currentPage

        for (let i = parseInt(initialPage); i <= parseInt(endPage); i++) {
            let playingPage = i.toString();

            for (let y = initialRepetition; y > 0; y--) {
                const pageAudioUrl = `https://everyayah.com/data/${selectedSubFolder}/PageMp3s/Page${playingPage.padStart(3, '0')}.mp3`;
                await playAudio(pageAudioUrl);
                setRepetitionCount(prevCount => prevCount - 1);
            }
            setRepetitionCount(initialRepetition);
            setCurrentPage((i+1).toString())
        }

        setRepetitionCount(initialRepetition);
    };

    const handleJuzRepetition = async () => {
        const initialRepetition = repetitionCount;
        const juzNumber = parseInt(currentJuz);

        let startPage = juzNumber === 1 ? 1 : (juzNumber - 1) * 20 + 2;
        let endPage = juzNumber === 1 ? 21 : startPage + 19;

        if (juzNumber === 30) {
            endPage = 604;
        }

        for (let i = startPage; i <= endPage; i++) {
            for (let y = initialRepetition; y > 0; y--) {
                const pageAudioUrl = `https://everyayah.com/data/${selectedSubFolder}/PageMp3s/Page${i.toString().padStart(3, '0')}.mp3`;
                await playAudio(pageAudioUrl);
                setRepetitionCount(prevCount => prevCount - 1);
            }
        }

        setRepetitionCount(initialRepetition);
    };

    const handleSurahRepetition = async () => {
        const initialRepetition = repetitionCount;
        const totalAyahs = parseInt(endSurahNumber) - parseInt(currentSurahNumber) + 1;

        for (let i = parseInt(currentSurahNumber); i < parseInt(currentSurahNumber) + totalAyahs; i++) {
            for (let y = initialRepetition; y > 0; y--) {
                const ayahAudioUrl = `https://everyayah.com/data/${selectedSubFolder}/${i.toString().padStart(3, '0')}${currentAyah.padStart(3, '0')}.mp3`;
                await playAudio(ayahAudioUrl);
                setRepetitionCount(prevCount => prevCount - 1);
            }
        }

        setRepetitionCount(initialRepetition);
    };

    const handleCustomRepetition = async () => {
        const initialRepetition = repetitionCount;
        let currentAyahNumber = parseInt(currentAyah);

        while (repetitionCount > 0) {
            for (let ayah = currentAyahNumber; ayah <= parseInt(endSurahNumber); ayah++) {
                const ayahAudioUrl = `https://everyayah.com/data/${selectedSubFolder}/${currentSurahNumber.padStart(3, '0')}${ayah.toString().padStart(3, '0')}.mp3`;

                for (let r = 0; r < ayahRepetition; r++) {
                    await playAudio(ayahAudioUrl);
                    setRepetitionCount(prevCount => prevCount - 1);
                }
                
                if (repetitionCount <= 0) break;
            }

            // Repeat range if needed
            if (repetitionCount > 0) {
                for (let r = 0; r < rangeRepetition; r++) {
                    if (repetitionCount <= 0) break;
                    currentAyahNumber = parseInt(currentAyah);
                }
            }
        }

        setRepetitionCount(initialRepetition);
    };

    const togglePlayPause = () => {
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                switch (repetitionMethod) {
                    case 'page':
                        handlePageRepetition();
                        break;
                    case 'juz':
                        handleJuzRepetition();
                        break;
                    case 'surah':
                        handleSurahRepetition();
                        break;
                    case 'custom':
                        handleCustomRepetition();
                        break;
                    default:
                        audio.play();
                        break;
                }
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
    );
};

export default TopMain;
