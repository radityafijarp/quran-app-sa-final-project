import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { Surah } from "../mainPage/types";

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

  currentSurahNumber: string;
  setCurrentSurahNumber: React.Dispatch<React.SetStateAction<string>>;

  endSurahNumber: string;
  setEndSurahNumber: React.Dispatch<React.SetStateAction<string>>;

  surahs:Surah[];
  setSurahs:React.Dispatch<React.SetStateAction<Surah[]>>;
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
  currentSurahNumber,
  setCurrentSurahNumber,
  endSurahNumber,
  setEndSurahNumber,
  surahs,
  setSurahs
}) => {
  // const [surahs, setSurahs] = useState<Surah[]>([]);
  const [ayahOptions, setAyahOptions] = useState<number[]>([]); // Store ayah options based on selected Surah

  const handleCurrentSurahChange = (surahNumber: string) => {
    const selectedSurah = surahs.find((surah) => surah.number.toString() === surahNumber);
    if (selectedSurah) {
      setCurrentSurah(selectedSurah.englishName); // Set Surah name
      setCurrentSurahNumber(surahNumber); // Set Surah number
      setAyahOptions(Array.from({ length: selectedSurah.numberOfAyahs }, (_, i) => i + 1)); // Set Ayah options
    }
  };

  const handleEndSurahChange = (surahNumber: string) => {
    const selectedSurah = surahs.find((surah) => surah.number.toString() === surahNumber);
    if (selectedSurah) {
      setEndSurah(selectedSurah.englishName); // Set Surah name
      setEndSurahNumber(surahNumber); // Set Surah number
      setAyahOptions(Array.from({ length: selectedSurah.numberOfAyahs }, (_, i) => i + 1)); // Set Ayah options for end range
    }
  };

  const handleCurrentAyahChange = (ayahNumber: string) => {
    setCurrentAyah(ayahNumber); // Update only the current Ayah
  };

  const handleEndAyahChange = (ayahNumber: string) => {
    setEndAyah(ayahNumber); // Update only the end Ayah
  };

  return (
    <>
      <div>
        <Label className="text-sm font-medium">Start Range</Label>
        <div className="grid grid-cols-2 gap-2">
          <Select onValueChange={handleCurrentSurahChange}>
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

          <Select onValueChange={handleCurrentAyahChange}>
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
          <Select onValueChange={handleEndSurahChange}>
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

          <Select onValueChange={handleEndAyahChange}>
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
