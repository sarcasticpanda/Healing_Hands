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
  verificationStatus?: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  documents?: VerificationDocument[];
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

export interface VerificationDocument {
  id: string;
  name: string;
  type: 'license' | 'degree' | 'certificate' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  uploadDate: string;
  reviewDate?: string;
  reviewNotes?: string;
  fileUrl?: string;
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
  doctorName?: string;
  doctorSpecialty?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  prescribedBy: string;
  prescribedDate: string;
  appointmentId: string;
  type: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'drops';
  status: 'active' | 'completed' | 'discontinued';
  sideEffects?: string[];
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'patient' | 'admin';
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
};