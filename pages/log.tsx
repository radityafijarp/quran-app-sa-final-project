import Link from 'next/link'
import { useEffect, useState } from 'react'
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

// Define the memorization entry type based on the API response
interface MemorizationEntry {
  ID: number
  SurahName: string
  AyahRange: string
  TotalAyah: number
  DateStarted: string
  DateCompleted: string
  ReviewFrequency: string
  AccuracyLevel: string
  Notes: string
}

export default function MemorizationLogPage() {
  const [memorizationData, setMemorizationData] = useState<MemorizationEntry[]>([])
  const [formData, setFormData] = useState({
    SurahName: '',
    AyahRange: '',
    TotalAyah: '',
    DateStarted: '',
    DateCompleted: '',
    ReviewFrequency: '',
    AccuracyLevel: '',
    Notes: ''
  })
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  useEffect(() => {
    // Fetch memorization data from the API
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/memorizes', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setMemorizationData(data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [token])

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/memorizes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        // Remove the deleted entry from state
        setMemorizationData(memorizationData.filter((entry) => entry.ID !== id))
      } else {
        console.error('Failed to delete entry')
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
    }
  }

  // Handle input change for the form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prepare the correct payload format
    const preparedData = {
      SurahName: formData.SurahName,
      AyahRange: formData.AyahRange,
      TotalAyah: parseInt(formData.TotalAyah),  // Convert TotalAyah to a number
      DateStarted: new Date(formData.DateStarted).toISOString(),  // Format DateStarted
      DateCompleted: formData.DateCompleted ? new Date(formData.DateCompleted).toISOString() : '', // Format DateCompleted if present
      ReviewFrequency: formData.ReviewFrequency,
      AccuracyLevel: formData.AccuracyLevel,
      Notes: formData.Notes
    }

    try {
      const response = await fetch('http://localhost:8080/memorizes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(preparedData),
      })

      if (response.ok) {
        const newEntry = await response.json()
        setMemorizationData([...memorizationData, newEntry])
        // Clear the form after successful submission
        setFormData({
          SurahName: '',
          AyahRange: '',
          TotalAyah: '',
          DateStarted: '',
          DateCompleted: '',
          ReviewFrequency: '',
          AccuracyLevel: '',
          Notes: ''
        })
        window.location.reload()
      } else {
        console.error('Failed to add entry')
      }
    } catch (error) {
      console.error('Error adding entry:', error)
    }
  }

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
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <Label htmlFor="SurahName">Surah Name</Label>
            <Input id="SurahName" value={formData.SurahName} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="AyahRange">Ayah Range</Label>
            <Input id="AyahRange" value={formData.AyahRange} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="TotalAyah">Total Ayah</Label>
            <Input id="TotalAyah" value={formData.TotalAyah} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="DateStarted">Date Started</Label>
            <Input type="date" id="DateStarted" value={formData.DateStarted} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="DateCompleted">Date Completed</Label>
            <Input type="date" id="DateCompleted" value={formData.DateCompleted} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="ReviewFrequency">Review Frequency</Label>
            <Input id="ReviewFrequency" value={formData.ReviewFrequency} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="AccuracyLevel">Accuracy Level</Label>
            <Input id="AccuracyLevel" value={formData.AccuracyLevel} onChange={handleChange} required />
          </div>
          <div className="col-span-full">
            <Label htmlFor="Notes">Notes</Label>
            <Input id="Notes" value={formData.Notes} onChange={handleChange} />
          </div>
          <div className="col-span-full">
            <Button type="submit">Add Entry</Button>
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
            <TableHead>Accuracy Level</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {memorizationData.map((entry) => (
          <TableRow key={entry.ID}>
            <TableCell>{entry.SurahName}</TableCell>
            <TableCell>{entry.AyahRange}</TableCell>
            <TableCell>{entry.TotalAyah}</TableCell>
            <TableCell>{new Date(entry.DateStarted).toLocaleDateString()}</TableCell>
            <TableCell>{entry.DateCompleted === "0001-01-01T07:00:00+07:00" ? "In Progress" : new Date(entry.DateCompleted).toLocaleDateString()}</TableCell>
            <TableCell>{entry.ReviewFrequency}</TableCell>
            <TableCell>{entry.AccuracyLevel}</TableCell>
            <TableCell>{entry.Notes}</TableCell>
            <TableCell>
              <Button variant="destructive" onClick={() => handleDelete(entry.ID)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      </Table>
    </div>
  )
}
