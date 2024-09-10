'use client'

import { useState,useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PerPage } from './repetitionMethod/perPage'
import { PerJuz } from './repetitionMethod/perJuz'
import { PerSurah } from './repetitionMethod/perSurah'
import Custom from './repetitionMethod/custom'
import SettingsMenu from './settings/settings'
import MainPage from './mainPage/mainPage'
import SelectMethod from './intialSidePage/selectMethod'
import SelectQori from './intialSidePage/selectQori'
import { Surah } from './mainPage/types'

export function QuranApp() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSurah, setCurrentSurah] = useState('Al-Faatiha')
  const [currentSurahNumber, setCurrentSurahNumber] = useState('1')
  const [endSurah, setEndSurah] = useState('1')
  const [endSurahNumber, setEndSurahNumber] = useState('1')
  const [currentAyah, setCurrentAyah] = useState('1')
  const [endAyah, setEndAyah] = useState('1')
  const [currentPage, setCurrentPage] = useState('1')
  const [endPage, setEndPage] = useState('1')
  const [currentJuz, setCurrentJuz] = useState('1')
  const [volume, setVolume] = useState(50)
  const [repetitionMethod, setRepetitionMethod] = useState('surah')
  const [repetitionCount, setRepetitionCount] = useState(1)
  const [autoPlay, setAutoPlay] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [ayahRepetition, setAyahRepetition] = useState(1)
  const [rangeRepetition, setRangeRepetition] = useState(1)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showTranslation, setShowTranslation] = useState(true)
  const [showTransliteration, setShowTransliteration] = useState(true)
  const [translationLanguage, setTranslationLanguage] = useState('indonesian')
  const [selectedSubFolder, setSelectedSubFolder] = useState('Ghamadi_40kbps')
  const [selectedQori, setSelectedQori] = useState('Ghamadi')
  const [mushafType,setMushafType]=useState("8")
  const [perPageAyah,setPerPageAyah]=useState("per ayah")

  const [surahs, setSurahs] = useState<Surah[]>([]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // console.log(selectedSubFolder)
  
  }

  
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

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className={`${isSidebarOpen ? 'w-96' : 'w-0'} transition-all duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-r border-gray-200 overflow-hidden`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Quran App</h1>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
          </div>
          <Tabs defaultValue="playback">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="playback">Playback</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="playback">
              <div className="space-y-4">
                <SelectQori
                  selectedSubFolder={selectedSubFolder}
                  setSelectedSubFolder={setSelectedSubFolder}
                  selectedQori={selectedQori}
                  setSelectedQori={setSelectedQori}
                />
                <SelectMethod
                  repetitionMethod={repetitionMethod}
                  setRepetitionMethod={setRepetitionMethod}
                />
                {repetitionMethod === 'page' && (
                  <PerPage
                    currentPage={currentPage} 
                    setCurrentPage={setCurrentPage}
                    endPage={endPage}
                    setEndPage={setEndPage}
                    ayahRepetition={ayahRepetition}
                    setAyahRepetition={setAyahRepetition}
                  />
                )}
                {repetitionMethod === 'juz' && (
                  <PerJuz
                  currentJuz={currentJuz}
                  setCurrentJuz={setCurrentJuz}
                  setCurrentPage={setCurrentPage}
                  />
                )}
                {repetitionMethod === 'surah' && (
                  <PerSurah
                  currentSurah={currentSurah}
                  setCurrentSurah={setCurrentSurah}
                  currentSurahNumber={currentSurahNumber}
                  setCurrentSurahNumber={setCurrentSurahNumber}
                  />
                )}
                {repetitionMethod === 'custom' && (
                  <Custom
                    ayahRepetition={ayahRepetition}
                    setAyahRepetition={setAyahRepetition}
                    rangeRepetition={rangeRepetition}
                    setRangeRepetition={setRangeRepetition}
                    currentSurah={currentSurah}
                    setCurrentSurah={setCurrentSurah}
                    endSurah={endSurah}
                    setEndSurah={setEndSurah}
                    currentAyah={currentAyah}
                    setCurrentAyah={setCurrentAyah}
                    endAyah={endAyah}
                    setEndAyah={setEndAyah}
                    setCurrentSurahNumber={setCurrentSurahNumber}
                    currentSurahNumber={currentSurahNumber}
                    setEndSurahNumber={setEndSurahNumber}
                    endSurahNumber={endSurahNumber}
                    surahs={surahs}
                    setSurahs={setSurahs}
                  />
                )}

                {repetitionMethod !== 'custom' && (
                  <div>
                    <Label className="text-sm font-medium">Repetition Count</Label>
                    <Select value={repetitionCount.toString()} onValueChange={(value) => setRepetitionCount(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(10)].map((_, i) => (
                          <SelectItem key={i} value={(i + 1).toString()}>{i + 1}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Switch id="autoplay" checked={autoPlay} onCheckedChange={setAutoPlay} />
                  <Label htmlFor="autoplay" className="text-sm font-medium">Auto-play next</Label>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <SettingsMenu 
              volume={volume}
              setVolume={setVolume}
              showTranslation={showTranslation}
              setShowTranslation={setShowTranslation}
              showTransliteration={showTransliteration}
              setShowTransliteration={setShowTransliteration}
              translationLanguage={translationLanguage}
              setTranslationLanguage={setTranslationLanguage}
              mushafType={mushafType}
              setMushafType={setMushafType}
              perPageAyah={perPageAyah}
              setPerPageAyah={setPerPageAyah}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <MainPage 
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      repetitionMethod={repetitionMethod}
      currentPage={currentPage}
      currentSurah={currentSurah}
      currentAyah={currentAyah}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      ayahRepetition={ayahRepetition}
      rangeRepetition={rangeRepetition}
      repetitionCount={repetitionCount}
      showTransliteration={showTransliteration}
      showTranslation={showTranslation}
      translationLanguage={translationLanguage}
      selectedQori={selectedQori}
      currentSurahNumber={currentSurahNumber}
      selectedSubFolder={selectedSubFolder}
      mushafType={mushafType}
      setCurrentPage={setCurrentPage}
      endPage={endPage}
      setAyahRepetition={setAyahRepetition}
      setRangeRepetition={setRangeRepetition}
      setRepetitionCount={setRepetitionCount}
      setCurrentAyah={setCurrentAyah}
      setCurrentSurah={setCurrentSurah}
      setCurrentSurahNumber={setCurrentSurahNumber}
      endSurahNumber={endSurahNumber}
      setCurrentJuz={setCurrentJuz}
      currentJuz={currentJuz}
      perPageAyah={perPageAyah}
      endAyah={endAyah}
      setEndAyah={setEndAyah}
      surahs={surahs}
      />
    </div>
  )
}