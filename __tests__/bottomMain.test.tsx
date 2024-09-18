import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import BottomMain from '@/components/mainPage/bottomMain'

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      data: {
        ayat: [
          { nomorAyat: 1, teksArab: 'Arabic text 1', teksLatin: 'Latin text 1', teksIndonesia: 'Indonesian text 1' },
          { nomorAyat: 2, teksArab: 'Arabic text 2', teksLatin: 'Latin text 2', teksIndonesia: 'Indonesian text 2' },
        ],
      },
    }),
  })
) as jest.Mock

// Mock Audio
const mockPlay = jest.fn()
const mockPause = jest.fn()
const mockAudio = jest.fn().mockImplementation(() => ({
  play: mockPlay,
  pause: mockPause,
  onended: jest.fn(),
}))
;(global as any).Audio = mockAudio

describe('BottomMain', () => {
  const defaultProps = {
    repetitionMethod: 'page',
    currentPage: '1',
    currentSurah: 'Al-Faatiha',
    currentAyah: '1',
    showTransliteration: true,
    showTranslation: true,
    translationLanguage: 'indonesian',
    currentSurahNumber: '1',
    selectedSubFolder: 'Ghamadi_40kbps',
    mushafType: '8',
    setCurrentPage: jest.fn(),
    perPageAyah: 'per ayah',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly for per ayah repetition method', async () => {
    render(<BottomMain {...defaultProps} />)
    await waitFor(() => {
      expect(screen.getByText('Arabic text 1')).toBeInTheDocument()
      expect(screen.getByText('Indonesian text 1')).toBeInTheDocument()
    })
  })

  it('renders correctly for per page repetition method', async () => {
    const perPageProps = { ...defaultProps, perPageAyah: 'per page' }
    render(<BottomMain {...perPageProps} />)
    await waitFor(() => {
      expect(screen.getByAltText('Mushaf Page 1')).toBeInTheDocument()
    })
  })

  it('handles play/pause button click', async () => {
    render(<BottomMain {...defaultProps} />)
    await waitFor(() => {
      const playButton = screen.getAllByRole('button', { name: /play/i })[0]
      fireEvent.click(playButton)
      expect(mockPlay).toHaveBeenCalled()
    })
  })

  it('navigates to next and previous pages', async () => {
    render(<BottomMain {...defaultProps} />)
    await waitFor(() => {
      const nextButton = screen.getByRole('button', { name: /next page/i })
      const prevButton = screen.getByRole('button', { name: /previous page/i })
      
      fireEvent.click(nextButton)
      expect(defaultProps.setCurrentPage).toHaveBeenCalledWith('2')

      fireEvent.click(prevButton)
      expect(defaultProps.setCurrentPage).toHaveBeenCalledWith('1')
    })
  })
})