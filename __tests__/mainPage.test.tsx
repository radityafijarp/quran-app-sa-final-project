import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import MainPage from '@/components/mainPage/mainPage'

// Mock child components
jest.mock('./topMain', () => {
  return function MockTopMain() {
    return <div data-testid="top-main">TopMain Component</div>
  }
})

jest.mock('./bottomMain', () => {
  return function MockBottomMain() {
    return <div data-testid="bottom-main">BottomMain Component</div>
  }
})

describe('MainPage', () => {
  const defaultProps = {
    isSidebarOpen: false,
    setIsSidebarOpen: jest.fn(),
    repetitionMethod: 'page',
    currentPage: '1',
    currentSurah: 'Al-Faatiha',
    currentAyah: '1',
    isPlaying: false,
    setIsPlaying: jest.fn(),
    ayahRepetition: 1,
    rangeRepetition: 1,
    repetitionCount: 1,
    showTransliteration: true,
    showTranslation: true,
    translationLanguage: 'english',
    selectedQori: 'Ghamadi',
    currentSurahNumber: '1',
    selectedSubFolder: 'Ghamadi_40kbps',
    mushafType: '8',
    setCurrentPage: jest.fn(),
    endPage: '2',
    setAyahRepetition: jest.fn(),
    setRangeRepetition: jest.fn(),
    setRepetitionCount: jest.fn(),
    setCurrentSurah: jest.fn(),
    setCurrentAyah: jest.fn(),
    setCurrentSurahNumber: jest.fn(),
    setCurrentJuz: jest.fn(),
    currentJuz: '1',
    endSurahNumber: '2',
    perPageAyah: 'per ayah',
    endAyah: '7',
    setEndAyah: jest.fn(),
    surahs: [],
  }

  it('renders without crashing', () => {
    render(<MainPage {...defaultProps} />)
    expect(screen.getByTestId('top-main')).toBeInTheDocument()
    expect(screen.getByTestId('bottom-main')).toBeInTheDocument()
  })

  it('displays correct title for page repetition method', () => {
    render(<MainPage {...defaultProps} />)
    expect(screen.getByText('Page 1')).toBeInTheDocument()
  })

  it('displays correct title for surah repetition method', () => {
    const surahProps = { ...defaultProps, repetitionMethod: 'surah' }
    render(<MainPage {...surahProps} />)
    expect(screen.getByText('Surah Al-Faatiha')).toBeInTheDocument()
  })
})