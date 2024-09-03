import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface perPageProps{
    currentPage:string;
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;

    endPage:string;
    setEndPage: React.Dispatch<React.SetStateAction<string>>;
}

export const PerPage: React.FC<perPageProps> = ({ 
    currentPage, 
    setCurrentPage,
    endPage,
    setEndPage
}) => {
    return (
        <div>
            <Label className="text-sm font-medium">Select Page</Label>
            <div className="grid grid-cols-2 gap-2">
                <Select>
                    <SelectTrigger>
                    <SelectValue placeholder="Page start" />
                    </SelectTrigger>
                    <SelectContent>
                    {[...Array(604)].map((_, i) => (
                        <SelectItem key={i} value={(i + 1).toString()}>{i + 1}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>

                {/* <Label className="text-sm font-medium">Select End Page</Label> */}
                <Select>
                    <SelectTrigger>
                    <SelectValue placeholder="Page end" />
                    </SelectTrigger>
                    <SelectContent>
                    {[...Array(604)].map((_, i) => (
                        <SelectItem key={i} value={(i + 1).toString()}>{i + 1}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}