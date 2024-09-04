import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TopMain from "./topMain";
import BottomMain from "./bottomMain";

interface mainPageProps{
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;

    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;

    repetitionMethod: string;
    currentPage: string;
    currentSurah: string;
    currentAyah: string;
    ayahRepetition: number;
    rangeRepetition: number;
    repetitionCount: number;
    showTransliteration: boolean;
    showTranslation: boolean;
    translationLanguage: string;
    selectedQori:string;
    currentSurahNumber:string;
    selectedSubFolder:string;
    mushafType:string;
}

const MainPage: React.FC<mainPageProps>= ({
  isSidebarOpen,
  setIsSidebarOpen,
  repetitionMethod,
  currentPage,
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
  selectedQori,
  currentSurahNumber,
  selectedSubFolder,
  mushafType}) => {

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen)
      // console.log(selectedSubFolder)
    }

    return(
    <div className="flex-1 flex flex-col">
        <div className="p-4 flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          <TopMain
          repetitionMethod={repetitionMethod}
          currentPage={currentPage}
          currentSurah={currentSurah}
          currentAyah={currentAyah}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          ayahRepetition={ayahRepetition}
          rangeRepetition={rangeRepetition}
          repetitionCount={repetitionCount}
          selectedQori={selectedQori}
          selectedSubFolder={selectedSubFolder}
          currentSurahNumber={currentSurahNumber}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>
                {repetitionMethod === 'page' || repetitionMethod === 'juz' ? 'Page Content' : 'Ayah Text'}
              </CardTitle>
            </CardHeader>
            <BottomMain 
            repetitionMethod={repetitionMethod}
            currentPage={currentPage}
            currentSurah={currentSurah}
            currentAyah={currentAyah}
            showTransliteration={showTransliteration}
            showTranslation={showTranslation}
            translationLanguage={translationLanguage}
            currentSurahNumber={currentSurahNumber}
            selectedSubFolder={selectedSubFolder}
            mushafType={mushafType}
            />
          </Card>
        </div>
    </div>

    )
}

export default MainPage;