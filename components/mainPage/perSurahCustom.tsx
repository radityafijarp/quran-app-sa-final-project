import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface Ayah {
    number: number;
    text: string;
    transliteration?: string;
    translation?: string;
}

interface PerSurahCustomProps {
    ayahs: Ayah[];
    playingAyah: number | null;
    handlePlayPause: (ayahNumber: number) => void;
    showTransliteration: boolean;
    showTranslation: boolean;
    transliterations: Record<number, string>;
    translations: Record<number, string>;
}

const PerSurahCustom: React.FC<PerSurahCustomProps> = ({
    ayahs,
    playingAyah,
    handlePlayPause,
    showTransliteration,
    showTranslation,
    transliterations,
    translations
}) => {
    return (
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
    );
};

export default PerSurahCustom;
