import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Component from '@/pages/log'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      {
        ID: 1,
        SurahName: 'Al-Baqarah',
        AyahRange: '1-5',
        TotalAyah: 5,
        DateStarted: '2023-01-01T00:00:00Z',
        DateCompleted: '2023-01-10T00:00:00Z',
        ReviewFrequency: 'Daily',
        AccuracyLevel: 'High',
        Notes: 'Test note'
      }
    ]),
  })
) as jest.Mock

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(() => 'fake-token'),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('LogPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the log page', async () => {
    render(<Component />)
    expect(screen.getByText('Memorization Log')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('Al-Baqarah')).toBeInTheDocument()
    })
  })

  it('fetches and displays memorization data', async () => {
    render(<Component />)
    await waitFor(() => {
      expect(screen.getByText('Al-Baqarah')).toBeInTheDocument()
      expect(screen.getByText('Ayah Range: 1-5')).toBeInTheDocument()
      expect(screen.getByText('Total Ayah: 5')).toBeInTheDocument()
    })
  })

  it('opens add entry form', async () => {
    render(<Component />)
    fireEvent.click(screen.getByRole('button', { name: 'Add Entry' }))
    await waitFor(() => {
      expect(screen.getByText('Add New Entry')).toBeInTheDocument()
    })
  })

  it('submits new entry', async () => {
    render(<Component />)
    fireEvent.click(screen.getByRole('button', { name: 'Add Entry' }))
    
    fireEvent.change(screen.getByLabelText('Surah Name'), { target: { value: 'An-Nas' } })
    fireEvent.change(screen.getByLabelText('Ayah Range'), { target: { value: '1-6' } })
    fireEvent.change(screen.getByLabelText('Total Ayah'), { target: { value: '6' } })
    fireEvent.change(screen.getByLabelText('Date Started'), { target: { value: '2023-06-01' } })
    fireEvent.change(screen.getByLabelText('Review Frequency'), { target: { value: 'Weekly' } })
    fireEvent.change(screen.getByLabelText('Accuracy Level'), { target: { value: 'Medium' } })

    fireEvent.click(screen.getByRole('button', { name: 'Add Entry' }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/memorizes', expect.any(Object))
    })
  })

  it('deletes an entry', async () => {
    render(<Component />)
    await waitFor(() => {
      expect(screen.getByText('Al-Baqarah')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/memorizes/1', expect.any(Object))
    })
  })

  it('navigates to edit page', async () => {
    render(<Component />)
    await waitFor(() => {
      expect(screen.getByText('Al-Baqarah')).toBeInTheDocument()
    })

    const editButton = screen.getByRole('link', { name: 'Edit' })
    expect(editButton).toHaveAttribute('href', '/edit/1')
  })

  it('navigates to home page', () => {
    render(<Component />)
    const homeButton = screen.getByRole('link', { name: 'Home' })
    expect(homeButton).toHaveAttribute('href', '/')
  })
})