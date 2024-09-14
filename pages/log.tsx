import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Home } from 'lucide-react'

// Sample data for demonstration
const memorizationData = [
  {
    surahName: "Al-Baqarah",
    ayahRange: "1-10",
    totalAyah: 10,
    dateStarted: "2023-06-01",
    dateCompleted: "2023-06-15",
    reviewFrequency: "Weekly",
    lastReviewDate: "2023-07-01",
    accuracyLevel: "90%",
    nextReviewDate: "2023-07-08",
    notes: "Focus on improving tajweed for ayahs 5-7"
  },
  {
    surahName: "Al-Imran",
    ayahRange: "1-20",
    totalAyah: 20,
    dateStarted: "2023-06-16",
    dateCompleted: "",
    reviewFrequency: "Daily",
    lastReviewDate: "2023-07-02",
    accuracyLevel: "75%",
    nextReviewDate: "2023-07-03",
    notes: "Struggling with memorization of ayahs 15-20"
  },
  // Add more sample data as needed
]

export default function MemorizationLogPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Memorization Log</h1>
        <Link href="/">
          <Button variant="outline" size="icon">
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Button>
        </Link>
      </div>
      
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Add New Entry</h2>
        <form className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <Label htmlFor="surahName">Surah Name</Label>
            <Input id="surahName" placeholder="Enter Surah name" />
          </div>
          <div>
            <Label htmlFor="ayahRange">Ayah Range</Label>
            <Input id="ayahRange" placeholder="e.g., 1-10" />
          </div>
          <div>
            <Label htmlFor="totalAyah">Total Ayah</Label>
            <Input id="totalAyah" type="number" placeholder="Enter total Ayahs" />
          </div>
          <div>
            <Label htmlFor="dateStarted">Date Started</Label>
            <Input id="dateStarted" type="date" />
          </div>
          <div>
            <Label htmlFor="dateCompleted">Date Completed</Label>
            <Input id="dateCompleted" type="date" />
          </div>
          <div>
            <Label htmlFor="reviewFrequency">Review Frequency</Label>
            <Input id="reviewFrequency" placeholder="e.g., Daily, Weekly" />
          </div>
          <div>
            <Label htmlFor="accuracyLevel">Accuracy Level</Label>
            <Input id="accuracyLevel" placeholder="e.g., 90%" />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" placeholder="Add any notes" />
          </div>
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
            <Button type="submit" className="w-full sm:w-auto">Add Entry</Button>
          </div>
        </form>
      </div>

      <Table>
        <TableCaption>Your Quran Memorization Progress</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Surah Name</TableHead>
            <TableHead>Ayah Range</TableHead>
            <TableHead>Total Ayah</TableHead>
            <TableHead>Date Started</TableHead>
            <TableHead>Date Completed</TableHead>
            <TableHead>Review Frequency</TableHead>
            <TableHead>Last Review Date</TableHead>
            <TableHead>Accuracy Level</TableHead>
            <TableHead>Next Review Date</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memorizationData.map((entry, index) => (
            <TableRow key={index}>
              <TableCell>{entry.surahName}</TableCell>
              <TableCell>{entry.ayahRange}</TableCell>
              <TableCell>{entry.totalAyah}</TableCell>
              <TableCell>{entry.dateStarted}</TableCell>
              <TableCell>{entry.dateCompleted || "In Progress"}</TableCell>
              <TableCell>{entry.reviewFrequency}</TableCell>
              <TableCell>{entry.lastReviewDate}</TableCell>
              <TableCell>{entry.accuracyLevel}</TableCell>
              <TableCell>{entry.nextReviewDate}</TableCell>
              <TableCell>{entry.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}