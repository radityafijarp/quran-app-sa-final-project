'use client'

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
import { Home, Pencil, Plus, X } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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

export default function Component() {
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
  const [isAddingEntry, setIsAddingEntry] = useState(false)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  useEffect(() => {
    fetchData()
  }, [])

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

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/memorizes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setMemorizationData(memorizationData.filter((entry) => entry.ID !== id))
      } else {
        console.error('Failed to delete entry')
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const preparedData = {
      SurahName: formData.SurahName,
      AyahRange: formData.AyahRange,
      TotalAyah: parseInt(formData.TotalAyah),
      DateStarted: new Date(formData.DateStarted).toISOString(),
      DateCompleted: formData.DateCompleted ? new Date(formData.DateCompleted).toISOString() : '',
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
        fetchData()
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
        setIsAddingEntry(false)
      } else {
        console.error('Failed to add entry')
      }
    } catch (error) {
      console.error('Error adding entry:', error)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Memorization Log</h1>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button onClick={() => setIsAddingEntry(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Entry
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add New Entry</SheetTitle>
                <SheetDescription>Fill in the details for your new memorization entry.</SheetDescription>
              </SheetHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
                <div>
                  <Label htmlFor="Notes">Notes</Label>
                  <Input id="Notes" value={formData.Notes} onChange={handleChange} />
                </div>
                <Button type="submit" className="w-full">Add Entry</Button>
              </form>
            </SheetContent>
          </Sheet>
          <Link href="/">
            <Button variant="outline">
              <Home className="mr-2 h-4 w-4" /> Home
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {memorizationData.map((entry) => (
          <Card key={entry.ID}>
            <CardHeader>
              <CardTitle>{entry.SurahName}</CardTitle>
              <CardDescription>Ayah Range: {entry.AyahRange}</CardDescription>
            </CardHeader>
            <CardContent>
              <p><strong>Total Ayah:</strong> {entry.TotalAyah}</p>
              <p><strong>Date Started:</strong> {new Date(entry.DateStarted).toLocaleDateString()}</p>
              <p><strong>Date Completed:</strong> {entry.DateCompleted === "0001-01-01T07:00:00+07:00" ? "In Progress" : new Date(entry.DateCompleted).toLocaleDateString()}</p>
              <p><strong>Review Frequency:</strong> {entry.ReviewFrequency}</p>
              <p><strong>Accuracy Level:</strong> {entry.AccuracyLevel}</p>
              <p><strong>Notes:</strong> {entry.Notes}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={`/edit/${entry.ID}`}>
                <Button variant="outline">
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
              </Link>
              <Button variant="destructive" onClick={() => handleDelete(entry.ID)}>
                <X className="mr-2 h-4 w-4" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}