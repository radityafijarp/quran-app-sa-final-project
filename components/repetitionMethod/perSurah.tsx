import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";

// Define the type for a Surah object
interface Surah {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
}

interface PerSurahProps {
    currentSurah: string;
    setCurrentSurah: React.Dispatch<React.SetStateAction<string>>;

    currentSurahNumber: string;
    setCurrentSurahNumber: React.Dispatch<React.SetStateAction<string>>;
}

export const PerSurah: React.FC<PerSurahProps> = ({ 
    currentSurah, 
    setCurrentSurah,
    currentSurahNumber,
    setCurrentSurahNumber
}) => {
    const [surahs, setSurahs] = useState<Surah[]>([]);

    useEffect(() => {
        async function fetchSurahs() {
            try {
                const response = await fetch("https://api.alquran.cloud/v1/surah");
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                // Assuming the data is in the 'data' key of the response
                setSurahs(result.data);
            } catch (error) {
                console.error("Error fetching Surah data:", error);
            }
        }

        fetchSurahs();
    }, []);

    const handleSurahChange = (value: string) => {
        const selectedSurah = surahs.find(surah => surah.number.toString() === value);
        setCurrentSurah(selectedSurah ? selectedSurah.englishName : "");
        // Set the surah number to match the selected surah
        setCurrentSurahNumber(value);
    };

    return (
        <div>
            <Label className="text-sm font-medium">Select Surah</Label>
            <Select onValueChange={handleSurahChange} value={currentSurahNumber}>
                <SelectTrigger>
                    <SelectValue placeholder="Select Surah" />
                </SelectTrigger>
                <SelectContent>
                    {surahs.map((surah) => (
                        <SelectItem key={surah.number} value={surah.number.toString()}>
                            {surah.englishName}
                        </SelectItem>
                        
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
