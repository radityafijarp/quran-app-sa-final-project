import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/router';

interface FormData {
  fullname: string;
  username: string;
  password: string;
  confirmPassword: string;
  desc: string;
  profilePic: string;
}

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({
    fullname: '',
    username: '',
    password: '',
    confirmPassword: '',
    desc: '',
    profilePic: ''
  });

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const payload = {
      fullname: formData.fullname,
      username: formData.username,
      password: formData.password,
      desc: formData.desc,
      profilePic: formData.profilePic || "https://images.unsplash.com/photo-1544642058-1f01423e7a16"
    };

    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('User registered successfully!');
        router.push('/login');
      } else {
        alert('Use another username');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="mt-2 text-sm text-gray-600">Sign up to get started</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullname">Full Name</Label>
              <Input id="fullname" type="text" value={formData.fullname} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" value={formData.username} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="desc">Description</Label>
              <Input id="desc" type="text" value={formData.desc} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="profilePic">Profile Picture URL</Label>
              <Input id="profilePic" type="url" value={formData.profilePic} onChange={handleChange} />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
