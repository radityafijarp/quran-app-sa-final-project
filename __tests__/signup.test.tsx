import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import SignUpPage from '@/pages/signup'

// Mock Next.js router
jest.mock('next/router', () => ({
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
    json: () => Promise.resolve({}),
  })
) as jest.Mock

describe('SignUpPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the sign-up form', () => {
    render(<SignUpPage />)
    
    expect(screen.getByText('Create an Account')).toBeInTheDocument()
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Profile Picture URL')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument()
    expect(screen.getByText('Already have an account?')).toBeInTheDocument()
    expect(screen.getByText('Log in')).toHaveAttribute('href', '/login')
  })

  it('updates form data on input change', () => {
    render(<SignUpPage />)
    
    const fullnameInput = screen.getByLabelText('Full Name')
    fireEvent.change(fullnameInput, { target: { value: 'John Doe' } })
    expect(fullnameInput).toHaveValue('John Doe')

    const usernameInput = screen.getByLabelText('Username')
    fireEvent.change(usernameInput, { target: { value: 'johndoe' } })
    expect(usernameInput).toHaveValue('johndoe')

    const passwordInput = screen.getByLabelText('Password')
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    expect(passwordInput).toHaveValue('password123')

    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    expect(confirmPasswordInput).toHaveValue('password123')

    const descInput = screen.getByLabelText('Description')
    fireEvent.change(descInput, { target: { value: 'A test user' } })
    expect(descInput).toHaveValue('A test user')

    const profilePicInput = screen.getByLabelText('Profile Picture URL')
    fireEvent.change(profilePicInput, { target: { value: 'https://example.com/pic.jpg' } })
    expect(profilePicInput).toHaveValue('https://example.com/pic.jpg')
  })

  it('shows an alert when passwords do not match', async () => {
    render(<SignUpPage />)
    
    jest.spyOn(window, 'alert').mockImplementation(() => {})

    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password456' } })
    
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }))

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Passwords do not match!')
    })
  })

  it('submits the form with correct data', async () => {
    render(<SignUpPage />)
    
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'johndoe' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'A test user' } })
    fireEvent.change(screen.getByLabelText('Profile Picture URL'), { target: { value: 'https://example.com/pic.jpg' } })

    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullname: 'John Doe',
          username: 'johndoe',
          password: 'password123',
          desc: 'A test user',
          profilePic: 'https://example.com/pic.jpg'
        })
      })
    })
  })

  it('shows an alert on successful registration', async () => {
    render(<SignUpPage />)
    
    jest.spyOn(window, 'alert').mockImplementation(() => {})

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'johndoe' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'A test user' } })

    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }))

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('User registered successfully!')
    })
  })

  it('shows an alert when username is already taken', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      })
    )

    render(<SignUpPage />)
    
    jest.spyOn(window, 'alert').mockImplementation(() => {})

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'johndoe' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'A test user' } })

    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }))

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Use another username')
    })
  })

  it('shows an alert when an error occurs during registration', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    )

    render(<SignUpPage />)
    
    jest.spyOn(window, 'alert').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'johndoe' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'A test user' } })

    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }))

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error:', expect.any(Error))
      expect(window.alert).toHaveBeenCalledWith('An error occurred')
    })
  })
})