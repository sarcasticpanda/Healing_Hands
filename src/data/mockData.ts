import { Doctor, Patient, Appointment } from '../types';

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@medical.com',
    speciality: 'Cardiology',
    experience: 12,
    fees: 150,
    location: 'New York, NY',
    rating: 4.8,
    totalReviews: 127,
    about: 'Experienced cardiologist with expertise in heart disease prevention and treatment.',
    education: 'MD from Harvard Medical School',
    availableSlots: ['09:00', '10:30', '14:00', '15:30'],
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: true,
    address: {
      street: '456 Heart Center Boulevard',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      googleMapsUrl: 'https://www.google.com/maps/place/456+Heart+Center+Boulevard,+New+York,+NY+10001'
    }
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@medical.com',
    speciality: 'Dermatology',
    experience: 8,
    fees: 120,
    location: 'Los Angeles, CA',
    rating: 4.9,
    totalReviews: 89,
    about: 'Specialized in skin conditions and cosmetic dermatology procedures.',
    education: 'MD from Stanford University',
    availableSlots: ['11:00', '13:00', '16:00', '17:30'],
    image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: true,
    address: {
      street: '789 Skin Care Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'United States',
      coordinates: { lat: 34.0522, lng: -118.2437 },
      googleMapsUrl: 'https://www.google.com/maps/place/789+Skin+Care+Avenue,+Los+Angeles,+CA+90210'
    }
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@medical.com',
    speciality: 'Pediatrics',
    experience: 15,
    fees: 100,
    location: 'Chicago, IL',
    rating: 4.7,
    totalReviews: 203,
    about: 'Dedicated pediatrician with a passion for child healthcare and development.',
    education: 'MD from Johns Hopkins University',
    availableSlots: ['08:30', '10:00', '14:30', '16:00'],
    image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: true,
    address: {
      street: '321 Children\'s Medical Plaza',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'United States',
      coordinates: { lat: 41.8781, lng: -87.6298 },
      googleMapsUrl: 'https://www.google.com/maps/place/321+Children\'s+Medical+Plaza,+Chicago,+IL+60601'
    }
  },
  {
    id: '4',
    name: 'Dr. Robert Thompson',
    email: 'robert.thompson@medical.com',
    speciality: 'Orthopedics',
    experience: 20,
    fees: 180,
    location: 'Houston, TX',
    rating: 4.6,
    totalReviews: 156,
    about: 'Orthopedic surgeon specializing in sports medicine and joint replacement.',
    education: 'MD from Mayo Clinic',
    availableSlots: ['09:30', '11:00', '15:00', '16:30'],
    image: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: true,
    address: {
      street: '654 Sports Medicine Center',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'United States',
      coordinates: { lat: 29.7604, lng: -95.3698 },
      googleMapsUrl: 'https://www.google.com/maps/place/654+Sports+Medicine+Center,+Houston,+TX+77001'
    }
  },
  {
    id: '5',
    name: 'Dr. Lisa Wang',
    email: 'lisa.wang@medical.com',
    speciality: 'Neurology',
    experience: 10,
    fees: 200,
    location: 'San Francisco, CA',
    rating: 4.9,
    totalReviews: 98,
    about: 'Neurologist with expertise in treating neurological disorders and brain health.',
    education: 'MD from UC San Francisco',
    availableSlots: ['10:00', '12:00', '14:00', '17:00'],
    image: 'https://images.pexels.com/photos/5327647/pexels-photo-5327647.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: true,
    address: {
      street: '987 Neuroscience Institute',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'United States',
      coordinates: { lat: 37.7749, lng: -122.4194 },
      googleMapsUrl: 'https://www.google.com/maps/place/987+Neuroscience+Institute,+San+Francisco,+CA+94102'
    }
  },
  {
    id: '6',
    name: 'Dr. David Miller',
    email: 'david.miller@medical.com',
    speciality: 'Psychiatry',
    experience: 14,
    fees: 160,
    location: 'Boston, MA',
    rating: 4.8,
    totalReviews: 112,
    about: 'Psychiatrist focused on mental health treatment and therapy.',
    education: 'MD from Harvard Medical School',
    availableSlots: ['09:00', '11:30', '14:30', '16:00'],
    image: 'https://images.pexels.com/photos/5327592/pexels-photo-5327592.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: true,
    address: {
      street: '147 Mental Health Center',
      city: 'Boston',
      state: 'MA',
      zipCode: '02101',
      country: 'United States',
      coordinates: { lat: 42.3601, lng: -71.0589 },
      googleMapsUrl: 'https://www.google.com/maps/place/147+Mental+Health+Center,+Boston,+MA+02101'
    }
  },
];

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    age: 35,
    gender: 'male',
    address: '123 Main St, New York, NY 10001',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    doctorId: '1',
    patientId: '1',
    date: '2024-01-15',
    time: '10:30',
    status: 'confirmed',
    symptoms: 'Chest pain and shortness of breath',
    notes: 'Patient reports symptoms during exercise',
  },
];

export const specialties = [
  'All Specialties',
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Neurology',
  'Psychiatry',
  'General Medicine',
  'Gynecology',
  'Oncology',
];

export const locations = [
  'All Locations',
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'San Francisco, CA',
  'Boston, MA',
];