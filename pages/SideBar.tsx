import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sun, Moon, Menu, BookOpen, LogIn, LogOut, UserPlus } from "lucide-react"
import SelectQori from '../components/intialSidePage/selectQori';
import SelectMethod from '../components/intialSidePage/selectMethod';
import { PerPage } from '../components/repetitionMethod/perPage';
import { PerJuz } from '../components/repetitionMethod/perJuz';
import { PerSurah } from '../components/repetitionMethod/perSurah';
import Custom from '../components/repetitionMethod/custom';
import SettingsMenu from '../components/settings/settings';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Surah } from '../components/mainPage/types';
import React from "react";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";

interface SideBarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  selectedQori: string;
  setSelectedQori: React.Dispatch<React.SetStateAction<string>>;

  selectedSubFolder: string;
  setSelectedSubFolder: React.Dispatch<React.SetStateAction<string>>;

  repetitionMethod: string;
  setRepetitionMethod: React.Dispatch<React.SetStateAction<string>>;

  surahs: Surah[];
  setSurahs: React.Dispatch<React.SetStateAction<Surah[]>>;

  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;

  endPage: string;
  setEndPage: React.Dispatch<React.SetStateAction<string>>;

  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;

  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;

  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  currentSurah: string;
  currentAyah: string;
  ayahRepetition: number;
  rangeRepetition: number;
  repetitionCount: number;
  showTransliteration: boolean;
  showTranslation: boolean;
  translationLanguage: string;
  currentSurahNumber: string;
  mushafType: string;
  setAyahRepetition: React.Dispatch<React.SetStateAction<number>>;
  setRangeRepetition: React.Dispatch<React.SetStateAction<number>>;
  setRepetitionCount: React.Dispatch<React.SetStateAction<number>>;
  setCurrentSurah: React.Dispatch<React.SetStateAction<string>>;
  setCurrentAyah: React.Dispatch<React.SetStateAction<string>>;
  setCurrentSurahNumber: React.Dispatch<React.SetStateAction<string>>;
  setCurrentJuz: React.Dispatch<React.SetStateAction<string>>;
  currentJuz: string;
  endSurahNumber: string;
  endAyah: string;
  setEndAyah: React.Dispatch<React.SetStateAction<string>>;
  setShowTranslation: React.Dispatch<React.SetStateAction<boolean>>;
  setShowTransliteration: React.Dispatch<React.SetStateAction<boolean>>;
  setTranslationLanguage: React.Dispatch<React.SetStateAction<string>>;
  setMushafType: React.Dispatch<React.SetStateAction<string>>;
  perPageAyah: string;
  setPerPageAyah: React.Dispatch<React.SetStateAction<string>>;
  endSurah: string;
  setEndSurah: React.Dispatch<React.SetStateAction<string>>;
  setEndSurahNumber: React.Dispatch<React.SetStateAction<string>>;
}

const SideBar: React.FC<SideBarProps> = ({
  isDarkMode,
  toggleDarkMode,
  selectedQori,
  setSelectedQori,
  selectedSubFolder,
  setSelectedSubFolder,
  repetitionMethod,
  setRepetitionMethod,
  surahs,
  setSurahs,
  currentPage,
  setCurrentPage,
  endPage,
  setEndPage,
  volume,
  setVolume,
  isSidebarOpen,
  setIsSidebarOpen,
  currentSurah,
  currentAyah,
  isPlaying,
  setIsPlaying,
  ayahRepetition,
  rangeRepetition,
  repetitionCount,
  showTransliteration,
  showTranslation,
  translationLanguage,
  currentSurahNumber,
  mushafType,
  setAyahRepetition,
  setRangeRepetition,
  setRepetitionCount,
  setCurrentAyah,
  setCurrentSurah,
  setCurrentSurahNumber,
  endSurahNumber,
  setCurrentJuz,
  currentJuz,
  perPageAyah,
  endAyah,
  setEndAyah,
  setShowTranslation,
  setShowTransliteration,
  setTranslationLanguage,
  setMushafType,
  setPerPageAyah,
  endSurah,
  setEndSurah,
  setEndSurahNumber,
}) => {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check for token in localStorage when component mounts
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const handleMemorizationLog = () => {
    if (isLoggedIn) {
      router.push('/log')
    } else {
      router.push('/login?redirect=/log')
    }
  }

  const handleSignUp = () => {
    router.push('/signup')
  }

  const handleLogin = () => {
    router.push('/login')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    router.push('/')
  }
  
  return (
      <>
    {/* Sidebar Toggle Button */}
    <Button
      variant="ghost"
      size="icon"
      className="fixed top-4 left-4 z-50" // Positioning the button
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    >
      <Menu className="h-6 w-6" />
    </Button>

    {/* Sidebar */}
    <div className={`${isSidebarOpen ? 'w-96' : 'w-0'} transition-all duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-r border-gray-200 overflow-hidden min-h-screen`}>
      <div className="p-6 pl-12"> {/* Adjust the padding here */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Memorize Quran App</h1>
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
                      {[...Array(20)].map((_, i) => (
                        <SelectItem key={i} value={(i + 1).toString()}>{i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
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
        {/* Memorization Log Button */}
        <Button 
            className="w-full mt-4" 
            onClick={handleMemorizationLog}
          >
            <BookOpen className="mr-2 h-4 w-4" /> Memorization Log
          </Button>
        </div>
        
        {/* Authentication Buttons */}
        <div className="p-6 pl-12">
          {isLoggedIn ? (
            <Button className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
          ) : (
            <>
              <Button className="w-full mb-2" onClick={handleSignUp}>
                <UserPlus className="mr-2 h-4 w-4" /> Sign Up
              </Button>
              <Button className="w-full" onClick={handleLogin}>
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Button>
            </>
          )}
      </div>
    </div>
  </>

  );
};

export default SideBar;
