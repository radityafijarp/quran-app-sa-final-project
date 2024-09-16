'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

export default function EditMemorizationEntry() {
  const router = useRouter()
  const { id } = router.query
  const [formData, setFormData] = useState<MemorizationEntry | null>(null)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  useEffect(() => {
    if (id) {
      fetchEntry()
    }
  }, [id])

  const fetchEntry = async () => {
    try {
      const response = await fetch(`http://localhost:8080/memorizes/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setFormData(data)
      }
    } catch (error) {
      console.error('Error fetching entry:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.id]: e.target.value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    const preparedData = {
      ...formData,
      TotalAyah: parseInt(formData.TotalAyah.toString()),
      DateStarted: new Date(formData.DateStarted).toISOString(),
      DateCompleted: formData.DateCompleted ? new Date(formData.DateCompleted).toISOString() : '',
    }

    try {
      const response = await fetch(`http://localhost:8080/memorizes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(preparedData),
      })

      if (response.ok) {
        router.push('/log')
      } else {
        console.error('Failed to update entry')
      }
    } catch (error) {
      console.error('Error updating entry:', error)
    }
  }

  if (!formData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Edit Memorization Entry</h1>
        <Link href="/log">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Log
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Entry: {formData.SurahName}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <Input type="date" id="DateStarted" value={formData.DateStarted.split('T')[0]} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="DateCompleted">Date Completed</Label>
                <Input type="date" id="DateCompleted" value={formData.DateCompleted ? formData.DateCompleted.split('T')[0] : ''} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="ReviewFrequency">Review Frequency</Label>
                <Input id="ReviewFrequency" value={formData.ReviewFrequency} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="AccuracyLevel">Accuracy Level</Label>
                <Input id="AccuracyLevel" value={formData.AccuracyLevel} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <Label htmlFor="Notes">Notes</Label>
              <Input id="Notes" value={formData.Notes} onChange={handleChange} />
            </div>
            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" /> Update Entry
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}