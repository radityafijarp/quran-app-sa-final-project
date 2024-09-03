import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function PerPage(){
    return (
        <div>
            <Label className="text-sm font-medium">Select Page</Label>
            <Select>
                <SelectTrigger>
                <SelectValue placeholder="Select page" />
                </SelectTrigger>
                <SelectContent>
                {[...Array(604)].map((_, i) => (
                    <SelectItem key={i} value={(i + 1).toString()}>{i + 1}</SelectItem>
                ))}
                </SelectContent>
            </Select>
        </div>
    )
}