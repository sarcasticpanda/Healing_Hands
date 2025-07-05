export interface Doctor {
  id: string;
  name: string;
  email: string;
  speciality: string;
  experience: number;
  fees: number;
  location: string;
  rating: number;
  totalReviews: number;
  about: string;
  education: string;
  availableSlots: string[];
  image: string;
  verified: boolean;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    googleMapsUrl?: string;
  };
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  address: string;
  image: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  symptoms: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'patient';
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
};