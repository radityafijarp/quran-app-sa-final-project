import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function PerJuz(){
    return (
        <div>
            <Label className="text-sm font-medium">Select Juz</Label>
            <Select>
                <SelectTrigger>
                <SelectValue placeholder="Select Juz" />
                </SelectTrigger>
                <SelectContent>
                {[...Array(30)].map((_, i) => (
                    <SelectItem key={i} value={(i + 1).toString()}>{i + 1}</SelectItem>
                ))}
                </SelectContent>
            </Select>
        </div>
    )
}