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
    const [selectedName, setSelectedName] = useState<string>("Ghamadi"); // Set default Qori name
    const [bitrates, setBitrates] = useState<string[]>([]);
    const [selectedBitrate, setSelectedBitrate] = useState<string>("40kbps"); // Set default bitrate

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

        // Set default values if not already set
        const defaultQori = "Ghamadi"; // Default Qori name
        const defaultBitrate = "40kbps"; // Default bitrate

        if (selectedQori === "" || selectedQori === undefined) {
            setSelectedQori(defaultQori);
            setSelectedName(defaultQori);
        }

        if (selectedBitrate === "" || selectedBitrate === undefined) {
            setSelectedBitrate(defaultBitrate);
        }

    }, [selectedQori, selectedBitrate]);

    useEffect(() => {
        if (selectedName) {
            // Filter bitrates based on the selected name
            const filteredBitrates = qoris
                .filter(qori => qori.name === selectedName)
                .map(qori => qori.bitrate);
            setBitrates(filteredBitrates);

            // Update bitrate to default if available
            if (filteredBitrates.includes("40kbps")) {
                setSelectedBitrate("40kbps");
            }
        }
    }, [selectedName, qoris]);

    useEffect(() => {
        if (selectedBitrate && selectedName) {
            const selectedQoriObj = qoris.find(qori => qori.name === selectedName && qori.bitrate === selectedBitrate);
            if (selectedQoriObj) {
                setSelectedSubFolder(selectedQoriObj.subfolder);
            }
        }
    }, [selectedBitrate, selectedName, qoris, setSelectedSubFolder]);

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
        // Reset bitrate selection if it's not in the new list
        if (!filteredBitrates.includes(selectedBitrate)) {
            setSelectedBitrate(filteredBitrates[0] || "40kbps");
        }
    };

    const handleBitrateChange = (bitrate: string) => {
        setSelectedBitrate(bitrate);
    };

    return (
        <div>
            <Label className="text-sm font-medium">Select Qari</Label>
            <Select onValueChange={handleNameChange} value={selectedQori || "Ghamadi"}>
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

            <div className="mt-4">
                <Label className="text-sm font-medium">Select Bitrate</Label>
                <Select onValueChange={handleBitrateChange} value={selectedBitrate || "40kbps"}>
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
        </div>
    );
}

export default SelectQori;
