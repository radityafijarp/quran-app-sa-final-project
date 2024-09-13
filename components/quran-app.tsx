'use client'

import { useState, useEffect } from 'react'
import MainPage from './mainPage/mainPage'
import { Surah } from './mainPage/types'
import SideBar from './SideBar'

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showTranslation, setShowTranslation] = useState(true)
  const [showTransliteration, setShowTransliteration] = useState(true)
  const [translationLanguage, setTranslationLanguage] = useState('indonesian')
  const [selectedSubFolder, setSelectedSubFolder] = useState('Ghamadi_40kbps')
  const [selectedQori, setSelectedQori] = useState('Ghamadi')
  const [mushafType, setMushafType] = useState("8")
  const [perPageAyah, setPerPageAyah] = useState("per ayah")

  const [surahs, setSurahs] = useState<Surah[]>([]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
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
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out transform lg:w-64 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <SideBar
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          selectedQori={selectedQori}
          setSelectedQori={setSelectedQori}
          selectedSubFolder={selectedSubFolder}
          setSelectedSubFolder={setSelectedSubFolder}
          repetitionMethod={repetitionMethod}
          setRepetitionMethod={setRepetitionMethod}
          surahs={surahs}
          setSurahs={setSurahs}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          endPage={endPage}
          setEndPage={setEndPage}
          volume={volume}
          setVolume={setVolume}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
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
          currentSurahNumber={currentSurahNumber}
          mushafType={mushafType}
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
          setShowTranslation={setShowTranslation}
          setShowTransliteration={setShowTransliteration}
          setTranslationLanguage={setTranslationLanguage}
          setMushafType={setMushafType}
          setPerPageAyah={setPerPageAyah}
          endSurah={endSurah}
          setEndSurah={setEndSurah}
          setEndSurahNumber={setEndSurahNumber}
        />
      </div>
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-96' : ''} lg:w-full`}>
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
    </div>
  )
}
