import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Repeat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Surah } from "./types";

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
    endAyah:string;
    setEndAyah: React.Dispatch<React.SetStateAction<string>>;

    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
    setAyahRepetition: React.Dispatch<React.SetStateAction<number>>;
    setRangeRepetition: React.Dispatch<React.SetStateAction<number>>;
    setRepetitionCount: React.Dispatch<React.SetStateAction<number>>;
    setCurrentSurah: React.Dispatch<React.SetStateAction<string>>;
    setCurrentAyah: React.Dispatch<React.SetStateAction<string>>;
    setCurrentSurahNumber: React.Dispatch<React.SetStateAction<string>>;
    setCurrentJuz: React.Dispatch<React.SetStateAction<string>>;
    surahs:Surah[];
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
    currentJuz,
    endAyah,
    setEndAyah,
    surahs
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
        const initialPage = currentPage;
        const initialAyahRepetition=ayahRepetition
        if (ayahRepetition == 1) {
            for (let i = parseInt(initialPage); i <= parseInt(endPage); i++) {
                let playingPage = i.toString();
    
                for (let y = initialRepetition; y > 0; y--) {
                    const pageAudioUrl = `https://everyayah.com/data/${selectedSubFolder}/PageMp3s/Page${playingPage.padStart(3, '0')}.mp3`;
                    await playAudio(pageAudioUrl);
                    setRepetitionCount(prevCount => prevCount - 1);
                }
                setRepetitionCount(initialRepetition);
                setCurrentPage((i + 1).toString());
            }
            setCurrentPage(initialPage);
            setRepetitionCount(initialRepetition);
        } else {
            for (let i = parseInt(initialPage); i <= parseInt(endPage); i++) {
                const playingPage = i.toString();
                setCurrentPage(playingPage);
    
                try {
                    const response = await fetch(`https://api.alquran.cloud/v1/page/${playingPage}`);
                    const result = await response.json();
                    for (let y = initialRepetition; y > 0; y--) {
                        if (result.data && result.data.ayahs) {
                            const ayahsData = result.data.ayahs;
        
                            for (const ayah of ayahsData) {
                                const ayahNumber = ayah.numberInSurah;
                                const surahNumber = ayah.surah.number;
        
                                for (let y = ayahRepetition; y > 0; y--) {
                                    const ayahAudioUrl = `https://everyayah.com/data/${selectedSubFolder}/${surahNumber.toString().padStart(3, '0')}${ayahNumber.toString().padStart(3, '0')}.mp3`;
                                    await playAudio(ayahAudioUrl);
                                    setAyahRepetition(prevCount => prevCount - 1);
                                }
        
                                setAyahRepetition(initialAyahRepetition); // Reset for the next Ayah
                            }
                        } else {
                            console.warn(`No Ayahs found for page ${playingPage}`);
                        }
                    }

                } catch (error) {
                    console.error("Error fetching Ayah data by page:", error);
                }
            }
    
            setCurrentPage(initialPage); // Reset to initial page after completion
            setRepetitionCount(initialRepetition); // Reset repetition count
        }
    };
    

    const handleJuzRepetition = async () => {
        const initialRepetition = repetitionCount;
        const juzNumber = parseInt(currentJuz);
        console.log("juz number "+juzNumber)
    
        if (isNaN(juzNumber) || juzNumber < 1 || juzNumber > 30) {
            console.warn(`Invalid Juz number: ${currentJuz}`);
            return; // Exit if Juz number is invalid
        }
    
        // Calculate start and end pages for the Juz
        let startPage = juzNumber === 1 ? 1 : (juzNumber - 1) * 20 + 2;
        let endPage = juzNumber === 1 ? 21 : startPage + 19;
    
        if (juzNumber === 30) {
            endPage = 604; // The last page of the Quran
        }
    
        setCurrentPage(startPage.toString()); // Set the initial current page
        console.log("current page "+currentPage)
        for (let y = initialRepetition; y > 0; y--) {
            for (let i = startPage; i <= endPage; i++) {
                const pageAudioUrl = `https://everyayah.com/data/${selectedSubFolder}/PageMp3s/Page${i.toString().padStart(3, '0')}.mp3`;
                try {
                    setCurrentPage(i.toString());
                    await playAudio(pageAudioUrl);

                } catch (error) {
                    console.error(`Error playing Page ${i} audio:`, error);
                }
            }
            setRepetitionCount(prevCount => prevCount - 1);
        }
    
        // Reset repetition count after all repetitions
        setRepetitionCount(initialRepetition);
    };
    

    const handleSurahRepetition = async () => {
        const initialRepetition = repetitionCount;
        const surah = surahs.find((surah) => surah.number === parseInt(currentSurahNumber));
    
        if (!surah) {
            console.warn(`Surah number ${currentSurahNumber} not found in surahs data`);
            return; // Exit if surah is not found
        }
    
        const totalAyahs = surah.numberOfAyahs;
        for (let y = initialRepetition; y > 0; y--) {
            for (let ayahNumber = 1; ayahNumber <= totalAyahs; ayahNumber++) {
                const ayahAudioUrl = `https://everyayah.com/data/${selectedSubFolder}/${currentSurahNumber.padStart(3, '0')}${ayahNumber.toString().padStart(3, '0')}.mp3`;
                
                try {
                    await playAudio(ayahAudioUrl);
                    
                } catch (error) {
                    console.error(`Error playing Ayah ${ayahNumber} audio:`, error);
                }
            }
            setRepetitionCount(prevCount => prevCount - 1);
        }
    
        // Reset repetition count after all repetitions
        setRepetitionCount(initialRepetition);
    };
    

    const handleCustomRepetition = async () => {
        // Ensure `surahs` is an array
        if (!Array.isArray(surahs)) {
            console.error("Surahs data is not available");
            return;
        }
    
        let currentAyahNumber = parseInt(currentAyah);
        let tempEndAyah = endAyah; // Initialize temporary end ayah with endAyah
        const initialAyahRepetition = ayahRepetition; // Store the initial ayah repetition count
        let localRepetitionCount = rangeRepetition; // Use a local variable for repetition count
    
        while (localRepetitionCount > 0) {
            currentAyahNumber = parseInt(currentAyah); // Reset current ayah at the start of each range
    
            // Loop through each surah in the range
            for (let surahNumber = parseInt(currentSurahNumber); surahNumber <= parseInt(endSurahNumber); surahNumber++) {
                // Ensure surah data exists
                const surah = surahs.find((surah) => surah.number === surahNumber);
                if (!surah) {
                    console.warn(`Surah number ${surahNumber} not found in surahs data`);
                    continue;
                }
    
                // Update the current surah state when it changes
                setCurrentSurah(surah.englishName);
    
                // Check if it's not the last surah in the range, then fetch the total ayahs
                if (surahNumber !== parseInt(endSurahNumber)) {
                    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
                    const surahData = await response.json();
                    tempEndAyah = surahData.data.numberOfAyahs; // Set tempEndAyah to the current surah's total ayahs
                } else {
                    tempEndAyah = endAyah; // For the last surah, use the specified end ayah
                }
    
                // Loop through ayahs within the surah
                for (let ayah = currentAyahNumber; ayah <= parseInt(tempEndAyah); ayah++) {
                    const ayahAudioUrl = `https://everyayah.com/data/${selectedSubFolder}/${surahNumber.toString().padStart(3, '0')}${ayah.toString().padStart(3, '0')}.mp3`;
    
                    // Update the current ayah state when it changes
                    setCurrentAyah(ayah.toString());
    
                    let localAyahRepetition = initialAyahRepetition; // Use a local variable for ayah repetition
    
                    // Play each ayah for the specified number of repetitions (ayahRepetition)
                    while (localAyahRepetition > 0) {
                        await playAudio(ayahAudioUrl); // Play the audio and wait for it to finish
                        localAyahRepetition--; // Decrease the local repetition count
                    }
                }
    
                // Reset currentAyahNumber for the next surah
                currentAyahNumber = 1;
    
                // If localRepetitionCount is depleted, stop the surah loop
                if (localRepetitionCount <= 0) break;
            }
    
            // Decrease the local repetition count after finishing the current range
            localRepetitionCount--;
        }
    
        // Update the state with the final repetition count
        setRepetitionCount(localRepetitionCount);
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
