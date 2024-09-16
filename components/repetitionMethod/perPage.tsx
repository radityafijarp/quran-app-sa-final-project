import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PerPageProps {
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;

  endPage: string;
  setEndPage: React.Dispatch<React.SetStateAction<string>>;

  ayahRepetition: number;
  setAyahRepetition: React.Dispatch<React.SetStateAction<number>>;
}

export const PerPage: React.FC<PerPageProps> = ({
  currentPage,
  setCurrentPage,
  endPage,
  setEndPage,
  ayahRepetition,
  setAyahRepetition,
}) => {
  const handlePageSelect = (start: string, end?: string) => {
    if (start) {
      setCurrentPage(start);
      if (!end || parseInt(end) < parseInt(start)) {
        setEndPage(start);
      }
    }
    if (end) {
      setEndPage(end);
    }
  };

  return (
    <div>
      {/* Select Page Section */}
      <div className="mb-4"> {/* Add margin-bottom for spacing */}
        <Label className="text-sm font-medium">Select Page</Label>
        <div className="grid grid-cols-2 gap-2">
          <Select onValueChange={(value) => handlePageSelect(value, endPage)}>
            <SelectTrigger>
              <SelectValue placeholder="Page start" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(604)].map((_, i) => (
                <SelectItem key={i} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handlePageSelect(currentPage, value)}>
            <SelectTrigger>
              <SelectValue placeholder="Page end" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(604 - parseInt(currentPage || "1") + 1)].map((_, i) => (
                <SelectItem key={i} value={(parseInt(currentPage || "1") + i).toString()}>
                  {parseInt(currentPage || "1") + i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Repetition Per Ayah Section */}
      <div>
        <Label className="text-sm font-medium">Repetition Per Ayah</Label>
        <div>
          <Select
            value={ayahRepetition.toString()}
            onValueChange={(value) => setAyahRepetition(parseInt(value))}
            >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[...Array(20)].map((_, i) => (
                <SelectItem key={i} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
