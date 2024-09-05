import React from "react";
import { Button } from "@/components/ui/button";

interface PerPageJuzProps {
    currentPage: string;
    mushafImageUrl: string;
    handleNextPage: () => void;
    handlePreviousPage: () => void;
}

const PerPageJuz: React.FC<PerPageJuzProps> = ({
    currentPage,
    mushafImageUrl,
    handleNextPage,
    handlePreviousPage
}) => {
    return (
        <>
            <img
                src={mushafImageUrl}
                alt={`Mushaf Page ${currentPage}`}
                className="mx-auto"
            />
            <div className="flex justify-between mt-4">
                <Button onClick={handlePreviousPage} variant="outline">
                    Previous Page
                </Button>
                <Button onClick={handleNextPage} variant="outline">
                    Next Page
                </Button>
            </div>
        </>
    );
};

export default PerPageJuz;
