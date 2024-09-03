import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import qoriData from "@/components/intialSidePage/qoriData.json"; 

// Define the type for a Qori object
interface Qori {
    subfolder: string;
    name: string;
    bitrate: string;
}

// Define the type for the entire qoriData object
interface QoriData {
    ayahCount: number[];
    [key: string]: Qori | number[]; // Index signature for accessing Qori by string key
}

interface selectQoriProps {
    selectedSubFolder: string;
    setSelectedSubFolder: React.Dispatch<React.SetStateAction<string>>;

    selectedQori: string;
    setSelectedQori: React.Dispatch<React.SetStateAction<string>>;
}

const SelectQori: React.FC<selectQoriProps> = ({
    selectedSubFolder,
    setSelectedSubFolder,
    selectedQori,
    setSelectedQori
}) => {
    const [qoris, setQoris] = useState<Qori[]>([]);
    const [uniqueNames, setUniqueNames] = useState<string[]>([]);
    const [selectedName, setSelectedName] = useState<string | null>(null);
    const [bitrates, setBitrates] = useState<string[]>([]);

    useEffect(() => {
        // Cast qoriData to QoriData type
        const qoriDataTyped = qoriData as QoriData;

        // Extract Qori data from the JSON object
        const qoriDataArray = Object.keys(qoriDataTyped)
            .filter((key) => key !== "ayahCount")
            .map((key) => qoriDataTyped[key] as Qori);

        setQoris(qoriDataArray);

        // Extract unique Qori names
        const namesSet = new Set(qoriDataArray.map(q => q.name));
        setUniqueNames(Array.from(namesSet));
    }, []);

    // Handle Qori name selection
    const handleNameChange = (name: string) => {
        setSelectedName(name);
        setSelectedQori(name);

        // Filter bitrates based on the selected name
        const filteredBitrates = qoris
            .filter(qori => qori.name === name)
            .map(qori => qori.bitrate);
        setBitrates(filteredBitrates);

        // Reset selectedSubFolder when the name changes
        setSelectedSubFolder("");
        // console.log("Selected Qori: ", name);
    };

    // Handle Bitrate selection and update SubFolder accordingly
    const handleBitrateChange = (bitrate: string) => {
        // Update the selected bitrate (optional if you want to track this separately)
        const selectedQoriObj = qoris.find(qori => qori.name === selectedQori && qori.bitrate === bitrate);

        if (selectedQoriObj) {
            setSelectedSubFolder(selectedQoriObj.subfolder);
            // console.log("Selected Subfolder: ", selectedQoriObj.subfolder);
        }

        // console.log('Selected Bitrate:', bitrate);
    };

    return (
        <div>
            <Label className="text-sm font-medium">Select Qari</Label>
            <Select onValueChange={handleNameChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Choose a Qari" />
                </SelectTrigger>
                <SelectContent>
                    {uniqueNames.map((name) => (
                        <SelectItem key={name} value={name}>
                            {name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {selectedName && (
                <div className="mt-4">
                    <Label className="text-sm font-medium">Select Bitrate</Label>
                    <Select onValueChange={handleBitrateChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose a Bitrate" />
                        </SelectTrigger>
                        <SelectContent>
                            {bitrates.map((bitrate, index) => (
                                <SelectItem key={index} value={bitrate}>
                                    {bitrate}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
    );
}

export default SelectQori;
