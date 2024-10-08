import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import React from "react";

interface settingsProps{
    volume: number;
    setVolume: React.Dispatch<React.SetStateAction<number>>;

    showTranslation: boolean;
    setShowTranslation: React.Dispatch<React.SetStateAction<boolean>>;

    showTransliteration: boolean;
    setShowTransliteration: React.Dispatch<React.SetStateAction<boolean>>;

    translationLanguage: string;
    setTranslationLanguage: React.Dispatch<React.SetStateAction<string>>;

    mushafType: string;
    setMushafType: React.Dispatch<React.SetStateAction<string>>;

    perPageAyah: string;
    setPerPageAyah: React.Dispatch<React.SetStateAction<string>>;
}


const SettingsMenu: React.FC<settingsProps>= ({
  volume,
  setVolume,
  showTranslation,
  setShowTranslation,
  showTransliteration,
  setShowTransliteration,
  translationLanguage,
  setTranslationLanguage,
  mushafType,
  setMushafType,
  perPageAyah,
  setPerPageAyah}) => {
    return (
        <TabsContent value="settings">
              <div className="space-y-4">
                <div>
                  {/* <Label className="text-sm font-medium">Volume</Label>
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4" />
                    <Slider
                      value={[volume]}
                      onValueChange={(value) => setVolume(value[0])}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm">{volume}%</span>
                  </div> */}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="show-translation" checked={showTranslation} onCheckedChange={setShowTranslation} />
                  <Label htmlFor="show-translation" className="text-sm font-medium">Show Translation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="show-transliteration" checked={showTransliteration} onCheckedChange={setShowTransliteration} />
                  <Label htmlFor="show-transliteration" className="text-sm font-medium">Show Transliteration</Label>
                </div>
                <div>
                  <Label className="text-sm font-medium">Translation Language</Label>
                  <Select value={translationLanguage} onValueChange={setTranslationLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="indonesian">Indonesian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Per Page/Juz Ayah Style</Label>
                  <Select value={perPageAyah} onValueChange={setPerPageAyah}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="per ayah">Per Ayah</SelectItem>
                      <SelectItem value="per page">Per Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Mushaf Style</Label>
                  <Select value={mushafType} onValueChange={setMushafType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(11)].map((_, i) => (
                        <SelectItem key={i} value={(i + 1).toString()}>{i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
        </TabsContent>
    )
}

export default SettingsMenu;