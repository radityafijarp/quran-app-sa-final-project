import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { QuranApp } from '../pages/quran-app'
import '@testing-library/jest-dom'
import SideBar from '@/pages/SideBar'

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: [{ number: 1, name: 'Al-Faatiha' }] }),
  })
) as jest.Mock

// Mock the MainPage and SideBar components
jest.mock('../components/mainPage/mainPage', () => {
  return function MockMainPage() {
    return <div data-testid="main-page">Main Page</div>
  }
})


describe('QuranApp', () => {
  it('renders without crashing', async () => {
    render(<QuranApp />)
    
    // Wait for the component to finish rendering
    await waitFor(() => {
      expect(screen.getByTestId('main-page')).toBeInTheDocument()
      expect(screen.getByTestId('side-bar')).toBeInTheDocument()
    })
  })

  it('fetches surah data on mount', async () => {
    render(<QuranApp />)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('https://api.alquran.cloud/v1/surah')
    })
  })

  it('applies dark mode class when isDarkMode is true', async () => {
    render(<QuranApp />)
    
    // Initially, it should not have the dark mode class
    expect(screen.getByTestId('main-page').parentElement).not.toHaveClass('bg-gray-900')
    
    // TODO: Implement a way to toggle dark mode and test it
    // This might involve passing a prop to MainPage to toggle dark mode
  })

  // Add more tests as needed for other functionalities
})