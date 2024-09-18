import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import SideBar from '@/pages/SideBar'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('SideBar', () => {
  const mockProps = {
    isDarkMode: false,
    toggleDarkMode: jest.fn(),
    selectedQori: 'Ghamadi',
    setSelectedQori: jest.fn(),
    selectedSubFolder: 'Ghamadi_40kbps',
    setSelectedSubFolder: jest.fn(),
    repetitionMethod: 'page',
    setRepetitionMethod: jest.fn(),
    surahs: [],
    setSurahs: jest.fn(),
    currentPage: '1',
    setCurrentPage: jest.fn(),
    endPage: '1',
    setEndPage: jest.fn(),
    volume: 50,
    setVolume: jest.fn(),
    isSidebarOpen: true,
    setIsSidebarOpen: jest.fn(),
    isPlaying: false,
    setIsPlaying: jest.fn(),
    currentSurah: 'Al-Faatiha',
    currentAyah: '1',
    ayahRepetition: 1,
    rangeRepetition: 1,
    repetitionCount: 1,
    showTransliteration: true,
    showTranslation: true,
    translationLanguage: 'english',
    currentSurahNumber: '1',
    mushafType: '8',
    setAyahRepetition: jest.fn(),
    setRangeRepetition: jest.fn(),
    setRepetitionCount: jest.fn(),
    setCurrentSurah: jest.fn(),
    setCurrentAyah: jest.fn(),
    setCurrentSurahNumber: jest.fn(),
    setCurrentJuz: jest.fn(),
    currentJuz: '1',
    endSurahNumber: '1',
    endAyah: '1',
    setEndAyah: jest.fn(),
    setShowTranslation: jest.fn(),
    setShowTransliteration: jest.fn(),
    setTranslationLanguage: jest.fn(),
    setMushafType: jest.fn(),
    perPageAyah: 'per ayah',
    setPerPageAyah: jest.fn(),
    endSurah: 'Al-Faatiha',
    setEndSurah: jest.fn(),
    setEndSurahNumber: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the sidebar when open', () => {
    render(<SideBar {...mockProps} />)
    expect(screen.getByText('Memorize Quran App')).toBeInTheDocument()
  })

  it('toggles dark mode', () => {
    render(<SideBar {...mockProps} />)
    const darkModeButton = screen.getByRole('button', { name: /sun|moon/i })
    fireEvent.click(darkModeButton)
    expect(mockProps.toggleDarkMode).toHaveBeenCalled()
  })

  it('renders playback and settings tabs', () => {
    render(<SideBar {...mockProps} />)
    expect(screen.getByRole('tab', { name: 'Playback' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Settings' })).toBeInTheDocument()
  })

  it('renders memorization log button', () => {
    render(<SideBar {...mockProps} />)
    expect(screen.getByRole('button', { name: 'Memorization Log' })).toBeInTheDocument()
  })

  it('renders login and signup buttons when not logged in', () => {
    localStorageMock.getItem.mockReturnValue(null)
    render(<SideBar {...mockProps} />)
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  it('renders logout button when logged in', async () => {
    localStorageMock.getItem.mockReturnValue('fake-token')
    render(<SideBar {...mockProps} />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Log Out' })).toBeInTheDocument()
    })
  })

  it('handles logout', async () => {
    localStorageMock.getItem.mockReturnValue('fake-token')
    const { rerender } = render(<SideBar {...mockProps} />)
    const logoutButton = await screen.findByRole('button', { name: 'Log Out' })
    fireEvent.click(logoutButton)
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
    rerender(<SideBar {...mockProps} />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    })
  })
})