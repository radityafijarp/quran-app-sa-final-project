import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";

interface customProps {
  ayahRepetition: number;
  setAyahRepetition: React.Dispatch<React.SetStateAction<number>>;

  rangeRepetition: number;
  setRangeRepetition: React.Dispatch<React.SetStateAction<number>>;

  currentSurah: string;
  setCurrentSurah: React.Dispatch<React.SetStateAction<string>>;

  endSurah: string;
  setEndSurah: React.Dispatch<React.SetStateAction<string>>;

  currentAyah: string;
  setCurrentAyah: React.Dispatch<React.SetStateAction<string>>;

  endAyah: string;
  setEndAyah: React.Dispatch<React.SetStateAction<string>>;
}

// Define the type for a Surah object
interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

const Custom: React.FC<customProps> = ({
  ayahRepetition,
  setAyahRepetition,
  rangeRepetition,
  setRangeRepetition,
  currentSurah,
  setCurrentSurah,
  endSurah,
  setEndSurah,
  currentAyah,
  setCurrentAyah,
  endAyah,
  setEndAyah,
}) => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [ayahOptions, setAyahOptions] = useState<number[]>([]); // Store ayah options based on selected Surah

  useEffect(() => {
    async function fetchSurahs() {
      try {
        const response = await fetch("https://api.alquran.cloud/v1/surah");
        const result = await response.json();

        setSurahs(result.data);
      } catch (error) {
        console.error("Error fetching Surah data:", error);
      }
    }

    fetchSurahs();
  }, []);

  const handleSurahChange = (surahNumber: string) => {
    setCurrentSurah(surahNumber);
    setEndSurah(surahNumber); // Update both current and end Surah

    // Find the selected Surah's numberOfAyahs to dynamically set ayah options
    const selectedSurah = surahs.find((surah) => surah.number.toString() === surahNumber);
    if (selectedSurah) {
      setAyahOptions(Array.from({ length: selectedSurah.numberOfAyahs }, (_, i) => i + 1));
    }
  };

  const handleAyahChange = (ayahNumber: string) => {
    setCurrentAyah(ayahNumber);
    setEndAyah(ayahNumber); // Update both current and end Ayah
  };
  

  return (
    <>
      <div>
        <Label className="text-sm font-medium">Start Range</Label>
        <div className="grid grid-cols-2 gap-2">
          <Select onValueChange={handleSurahChange}>
            <SelectTrigger>
              <SelectValue placeholder="Surah Start" />
            </SelectTrigger>
            <SelectContent>
              {surahs.map((surah) => (
                <SelectItem key={surah.number} value={surah.number.toString()}>
                  {surah.englishName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={handleAyahChange}>
            <SelectTrigger>
              <SelectValue placeholder="Ayah Start" />
            </SelectTrigger>
            <SelectContent>
              {ayahOptions.map((ayah) => (
                <SelectItem key={ayah} value={ayah.toString()}>
                  {ayah}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
      </div>
      <div>
        <Label className="text-sm font-medium">End Range</Label>
        <div className="grid grid-cols-2 gap-2">
          <Select onValueChange={handleSurahChange}>
            <SelectTrigger>
              <SelectValue placeholder="Surah End" />
            </SelectTrigger>
            <SelectContent>
              {surahs.map((surah) => (
                <SelectItem key={surah.number} value={surah.number.toString()}>
                  {surah.englishName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleAyahChange}>
            <SelectTrigger>
              <SelectValue placeholder="Ayah End" />
            </SelectTrigger>
            <SelectContent>
              {ayahOptions.map((ayah) => (
                <SelectItem key={ayah} value={ayah.toString()}>
                  {ayah}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label className="text-sm font-medium">Repetition Per Ayah</Label>
        <Input
          type="number"
          min="1"
          value={ayahRepetition}
          onChange={(e) => setAyahRepetition(Math.max(1, parseInt(e.target.value)))}
          className="w-full"
        />
      </div>
      <div>
        <Label className="text-sm font-medium">Repetition Per Range</Label>
        <Input
          type="number"
          min="1"
          value={rangeRepetition}
          onChange={(e) => setRangeRepetition(Math.max(1, parseInt(e.target.value)))}
          className="w-full"
        />
      </div>
    </>
  );
};

export default Custom;
