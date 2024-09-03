import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface selectMethodProps{
    repetitionMethod: string;
    setRepetitionMethod: React.Dispatch<React.SetStateAction<string>>;

}

const SelectMethod: React.FC<selectMethodProps>= ({repetitionMethod,setRepetitionMethod}) => {
    return (
    <div>
        <Label className="text-sm font-medium">Repetition Method</Label>
        <Select value={repetitionMethod} onValueChange={setRepetitionMethod}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="page">Per Page</SelectItem>
            <SelectItem value="juz">Per Juz</SelectItem>
            <SelectItem value="surah">Per Surah</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>
    )
}

export default SelectMethod;