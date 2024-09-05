import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import mushafTypes from '@/components/mainPage/mushafTypes.json'; // Adjust the path as necessary

interface MushafData {
    extension: string;
    initialUrl: string;
    initial: string;
}

interface MushafCollection {
    [key: string]: MushafData;
}

const mushafDataCollection: MushafCollection = mushafTypes;

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
    mushafType: string;
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
    perPageAyah: string;
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
    selectedSubFolder,
    mushafType,
    setCurrentPage,
    perPageAyah
}) => {
    const [ayahs, setAyahs] = useState<Ayah[]>([]);
    const [translations, setTranslations] = useState<Record<number, string>>({});
    const [transliterations, setTransliterations] = useState<Record<number, string>>({});
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
    const [playingAyah, setPlayingAyah] = useState<number | null>(null);
    const [mushafImageUrl, setMushafImageUrl] = useState<string>("");

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

    useEffect(() => {
        const mushaf = mushafDataCollection[mushafType];
    
        if (mushaf) {
            const paddedPageNumber = mushaf.initial === "Yes" ? currentPage.padStart(3, '0') : currentPage;
            setMushafImageUrl(`${mushaf.initialUrl}${paddedPageNumber}${mushaf.extension}`);
        }
    }, [currentPage, mushafType]);

    useEffect(() => {
        if (perPageAyah === "per ayah") {
            // Fetch Ayahs by page when perPageAyah is set to "per ayah"
            const fetchAyahsByPage = async () => {
                try {
                    const response = await fetch(`https://api.alquran.cloud/v1/page/${currentPage}`);
                    const result = await response.json();
                    const ayahsData = result.data.ayahs.map((ayah: any) => ({
                        number: ayah.numberInSurah,
                        text: ayah.text,
                        surahNumber: ayah.surah.number
                    }));
                    setAyahs(ayahsData);
    
                    // Fetch Bahasa translations for each Ayah
                    const translationPromises = ayahsData.map(async (ayah: any) => {
                        const translationResponse = await fetch(`https://quran-api-id.vercel.app/surahs/${ayah.surahNumber}/ayahs/${ayah.number}`);
                        const translationResult = await translationResponse.json();
                        return {
                            ayahNumber: ayah.number,
                            translation: translationResult.translation
                        };
                    });
    
                    const translationsData = await Promise.all(translationPromises);
                    const translationMap: Record<number, string> = {};
                    translationsData.forEach(({ ayahNumber, translation }) => {
                        translationMap[ayahNumber] = translation;
                    });
                    setTranslations(translationMap);
                } catch (error) {
                    console.error("Error fetching Ayah data by page:", error);
                }
            };
    
            fetchAyahsByPage();
        }
    }, [currentPage, perPageAyah]);
    
    

    const handlePlayPause = async (ayahNumber: number) => {
        if (playingAyah === ayahNumber) {
            currentAudio?.pause();
            setPlayingAyah(null);
        } else {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
    
            let surahNumber = currentSurahNumber;
            if (perPageAyah === "per ayah") {
                // Fetch Surah number and Ayah number from API if in "per ayah" mode
                try {
                    const response = await fetch(`https://api.alquran.cloud/v1/page/${currentPage}`);
                    const result = await response.json();
                    const ayah = result.data.ayahs.find((a: any) => a.number === ayahNumber);
                    if (ayah) {
                        surahNumber = ayah.surah.number;
                    }
                } catch (error) {
                    console.error("Error fetching Surah number and Ayah number:", error);
                    return;
                }
            }
    
            const audioUrl = `https://everyayah.com/data/${selectedSubFolder}/${surahNumber.padStart(3, '0')}${ayahNumber.toString().padStart(3, '0')}.mp3`;
            const newAudio = new Audio(audioUrl);
    
            newAudio.play().then(() => {
                setPlayingAyah(ayahNumber);
                setCurrentAudio(newAudio);
            }).catch(error => {
                console.error("Error playing audio:", error);
                setPlayingAyah(null);
            });
    
            newAudio.onended = () => {
                setPlayingAyah(null);
            };
        }
    };
    

    const handleNextPage = () => {
        if (parseInt(currentPage)<604){
            setCurrentPage((parseInt(currentPage)+1).toString());
        }
    };

    const handlePreviousPage = () => {
        if (parseInt(currentPage)>1){
            setCurrentPage((parseInt(currentPage)-1).toString());
        }
         // Ensures the page doesn't go below 1
    };

    return (
        <CardContent>
            {repetitionMethod === 'page' || repetitionMethod === 'juz' ? (
                <>
                    {perPageAyah === "per page" ? (
                        // Render Mushaf image for "per page" repetition method
                        <>
                            <img
                                src={mushafImageUrl}
                                alt={`Mushaf Page ${currentPage}`}
                                className="mx-auto"
                            />
                            <div className="flex justify-between mt-4">
                                <Button onClick={handlePreviousPage} variant="outline">
                                    Previous Page
                                </Button>
                                <Button onClick={handleNextPage} variant="outline">
                                    Next Page
                                </Button>
                            </div>
                        </>
                    ) : (
                        // Render ayahs with play buttons and translations for "per ayah" repetition method
                        <>
                            {ayahs.length > 0 ? (
                                <>
                                    {ayahs.map((ayah) => (
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
                                                {showTranslation && translations[ayah.number] && (
                                                    <p className="mb-2">
                                                        {translations[ayah.number]}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {/* Next and Previous buttons */}
                                    <div className="flex justify-between mt-4">
                                        <Button onClick={handlePreviousPage} variant="outline">
                                            Previous Page
                                        </Button>
                                        <Button onClick={handleNextPage} variant="outline">
                                            Next Page
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <p>No data available.</p>
                            )}
                        </>
                    )}
                </>
            ) : (
                // Render for custom/surah methods
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
                                    {showTranslation && translations[ayah.number] && (
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
