import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PerJuzProps {
  currentJuz: string;
  setCurrentJuz: React.Dispatch<React.SetStateAction<string>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

export const PerJuz: React.FC<PerJuzProps> = ({
  currentJuz,
  setCurrentJuz,
  setCurrentPage,
}) => {
  // Function to handle Juz selection change
  const handleJuzChange = (juz: string) => {
    setCurrentJuz(juz); // Update the state with the selected Juz

    const juzNumber = parseInt(juz); // Use the selected Juz value, not currentJuz
    console.log("juz number: " + juzNumber);

    // Calculate the start page based on the selected Juz
    const startPage = juzNumber === 1 ? 1 : (juzNumber - 1) * 20 + 2;
    setCurrentPage(startPage.toString());
  };

  return (
    <div>
      <Label className="text-sm font-medium">Select Juz</Label>
      <Select onValueChange={handleJuzChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Juz" />
        </SelectTrigger>
        <SelectContent>
          {[...Array(30)].map((_, i) => (
            <SelectItem key={i} value={(i + 1).toString()}>
              {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
