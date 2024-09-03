import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { CardContent } from "@/components/ui/card";

interface BottomMainPageProps {
    repetitionMethod: string;
    currentPage: string;
    currentSurah: string;
    currentAyah: string;
    showTransliteration: boolean;
    showTranslation: boolean;
    translationLanguage: string;
    currentSurahNumber: string;
    selectedSubFolder: string;
}

interface Ayah {
    number: number;
    text: string;
    transliteration?: string;
    translation?: string;
}

const BottomMain: React.FC<BottomMainPageProps> = ({
    repetitionMethod,
    currentPage,
    currentSurah,
    currentAyah,
    showTransliteration,
    showTranslation,
    translationLanguage,
    currentSurahNumber,
    selectedSubFolder
}) => {
    const [ayahs, setAyahs] = useState<Ayah[]>([]);
    const [translations, setTranslations] = useState<Record<number, string>>({});
    const [transliterations, setTransliterations] = useState<Record<number, string>>({});
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
    const [playingAyah, setPlayingAyah] = useState<number | null>(null);

    useEffect(() => {
        async function fetchAyahs() {
            if (currentSurahNumber) {
                try {
                    const response = await fetch(`https://equran.id/api/v2/surat/${currentSurahNumber}`);
                    const result = await response.json();
                    const ayahsData = result.data.ayat.map((ayah: any) => ({
                        number: ayah.nomorAyat,
                        text: ayah.teksArab
                    }));
                    setAyahs(ayahsData);
                } catch (error) {
                    console.error("Error fetching Surah data:", error);
                }
            }
        }

        async function fetchTranslationsAndTransliterations() {
            if (currentSurahNumber) {
                try {
                    const response = await fetch(`https://equran.id/api/v2/surat/${currentSurahNumber}`);
                    const result = await response.json();

                    const transliterationMap: Record<number, string> = {};
                    const translationMap: Record<number, string> = {};
                    
                    result.data.ayat.forEach((ayah: any) => {
                        transliterationMap[ayah.nomorAyat] = ayah.teksLatin;
                        translationMap[ayah.nomorAyat] = ayah.teksIndonesia;
                    });

                    setTransliterations(transliterationMap);
                    setTranslations(translationMap);

                    if (translationLanguage === 'english') {
                        const englishResponse = await fetch(`https://api.alquran.cloud/v1/surah/${currentSurahNumber}/en.asad`);
                        const englishResult = await englishResponse.json();

                        const englishTranslationMap: Record<number, string> = {};
                        englishResult.data.ayahs.forEach((ayah: any) => {
                            englishTranslationMap[ayah.numberInSurah] = ayah.text;
                        });

                        setTranslations(prevTranslations => ({
                            ...prevTranslations,
                            ...englishTranslationMap
                        }));
                    }

                } catch (error) {
                    console.error("Error fetching translation and transliteration data:", error);
                }
            }
        }

        fetchAyahs();
        fetchTranslationsAndTransliterations();
    }, [currentSurahNumber, translationLanguage]);

    const handlePlayPause = (ayahNumber: number) => {
        if (playingAyah === ayahNumber) {
            // Pause if already playing this Ayah
            currentAudio?.pause();
            setPlayingAyah(null);
        } else {
            // Stop the currently playing audio if any
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }

            // Construct the audio URL
            const audioUrl = `https://everyayah.com/data/${selectedSubFolder}/${currentSurahNumber.padStart(3, '0')}${ayahNumber.toString().padStart(3, '0')}.mp3`;
            const newAudio = new Audio(audioUrl);

            // Play the selected Ayah
            newAudio.play().then(() => {
                setPlayingAyah(ayahNumber);
                setCurrentAudio(newAudio);
            }).catch(error => {
                console.error("Error playing audio:", error);
                setPlayingAyah(null);
            });

            // Pause audio after finishing to reset play state
            newAudio.onended = () => {
                setPlayingAyah(null);
            };
        }
    };

    return (
        <CardContent>
            {repetitionMethod === 'page' || repetitionMethod === 'juz' ? (
                <p>Content of page {currentPage}</p>
            ) : (
                <>
                    {ayahs.length > 0 ? (
                        ayahs.map((ayah) => (
                            <div key={ayah.number} className="mb-4 p-4 border border-gray-300 rounded flex items-start">
                                <div className="mr-4 text-xl font-bold flex items-center space-x-2">
                                    <Button onClick={() => handlePlayPause(ayah.number)} size="icon" variant="outline">
                                        {playingAyah === ayah.number ? (
                                            <Pause className="h-4 w-4" />
                                        ) : (
                                            <Play className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <span>{ayah.number}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="text-right text-4xl mb-2 font-['Scheherazade']">
                                        {ayah.text}
                                    </div>
                                    {showTransliteration && transliterations[ayah.number] && (
                                        <p className="text-lg mb-2 italic">
                                            {transliterations[ayah.number]}
                                        </p>
                                    )}
                                    {showTranslation && (
                                        <p className="mb-2">
                                            {translations[ayah.number]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No data available.</p>
                    )}
                </>
            )}
        </CardContent>
    );
};

export default BottomMain;
