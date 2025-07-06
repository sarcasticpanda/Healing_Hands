# Healing Hands - Medical Appointment Booking System

A modern, responsive web application for booking medical appointments with verified doctors. Built with React, TypeScript, and Tailwind CSS.

## 🏥 Project Overview

Healing Hands is a comprehensive healthcare appointment booking platform that connects patients with verified medical professionals. The application provides an intuitive interface for patients to search, filter, and book appointments with doctors across various specialties.

### ✨ Key Features

#### For Patients:
- **Doctor Search & Discovery**: Advanced search and filtering system
- **Appointment Booking**: Easy-to-use appointment scheduling
- **Dashboard**: Personal dashboard to manage appointments and profile
- **Multiple View Modes**: List and map view for doctor discovery
- **Real-time Filtering**: Filter by specialty, location, fees, rating, and experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

#### For Doctors:
- **Professional Profiles**: Comprehensive doctor profiles with verification badges
- **Appointment Management**: View and manage patient appointments
- **Document Verification**: Upload medical licenses and certificates for verification
- **Clinic Location Management**: Set and manage clinic address with Google Maps integration
- **Availability Management**: Set available time slots for appointments

#### General Features:
- **Dual Authentication**: Separate login flows for patients and doctors
- **Theme Support**: Light (Green) and Dark theme options
- **Verification System**: Doctor verification with document upload
- **Google Maps Integration**: Location services and directions
- **Real-time Updates**: Dynamic filtering and search results
- **Secure Authentication**: Role-based access control

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom theme system
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Development**: Hot Module Replacement (HMR)
- **Code Quality**: ESLint with TypeScript support
- **Maps**: Google Maps integration for clinic locations

## 📋 Prerequisites

Before running this project locally, make sure you have the following installed:

- **Node.js** (version 16.0 or higher)
- **npm** (comes with Node.js) or **yarn**
- A modern web browser (Chrome, Firefox, Safari, Edge)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd healing-hands
```

### 2. Install Dependencies

```bash
npm install
```

or if you prefer yarn:

```bash
yarn install
```

### 3. Start the Development Server

```bash
npm run dev
```

or with yarn:

```bash
yarn dev
```

### 4. Open in Browser

The application will automatically open in your default browser at:
```
http://localhost:5173
```

If it doesn't open automatically, manually navigate to the URL above.

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── AdvancedDoctorFilter.tsx    # Advanced filtering system
│   ├── AppointmentModal.tsx        # Appointment booking modal
│   ├── AuthModal.tsx               # Authentication modal
│   ├── Dashboard.tsx               # Main dashboard component
│   ├── DoctorCard.tsx              # Doctor profile card
│   ├── DoctorLocationManager.tsx   # Location management
│   ├── DoctorSearch.tsx            # Doctor search interface
│   ├── DoctorVerification.tsx      # Document verification
│   ├── Header.tsx                  # Navigation header
│   ├── Hero.tsx                    # Landing page hero section
│   ├── MapSearch.tsx               # Map-based doctor search
│   ├── PatientDashboard.tsx        # Patient-specific dashboard
│   ├── SpecialtyFilter.tsx         # Specialty filtering
│   └── ThemeToggle.tsx             # Theme switching component
├── context/              # React Context providers
│   ├── AuthContext.tsx             # Authentication state management
│   └── ThemeContext.tsx            # Theme state management
├── data/                 # Mock data and constants
│   └── mockData.ts                 # Sample doctors, patients, appointments
├── types/                # TypeScript type definitions
│   └── index.ts                    # All interface definitions
├── App.tsx               # Main application component
├── main.tsx              # Application entry point
└── index.css             # Global styles and theme variables
```

## 🎨 Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build the project for production
- **`npm run preview`** - Preview the production build locally
- **`npm run lint`** - Run ESLint to check code quality

## 🔧 Configuration

### Theme Customization

The application supports two themes:
- **Green Theme** (default): Light theme with green accents
- **Dark Theme**: Dark theme with blue accents

Themes can be switched using the theme toggle in the header.

### Environment Setup

The project uses Vite for development and building. Configuration can be found in:
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## 👥 User Roles & Demo Accounts

### Patient Account
- **Role**: Patient
- **Features**: Search doctors, book appointments, manage profile
- **Demo Login**: Use any email/password combination with "Patient" role selected

### Doctor Account
- **Role**: Doctor
- **Features**: Manage appointments, upload verification documents, set clinic location
- **Demo Login**: Use any email/password combination with "Doctor" role selected

## 🗺️ Key Features Guide

### For Patients:

1. **Finding Doctors**:
   - Use the search bar to find doctors by name, specialty, or location
   - Apply advanced filters for precise results
   - Switch between list and map view
   - Sort results by rating, fees, experience, or name

2. **Booking Appointments**:
   - Click "Book Appointment" on any doctor card
   - Select preferred date and time
   - Describe symptoms or reason for visit
   - Confirm appointment details

3. **Managing Appointments**:
   - View all appointments in the dashboard
   - Track appointment status (pending, confirmed, completed)
   - Access appointment history

### For Doctors:

1. **Profile Management**:
   - Complete professional profile with education and experience
   - Upload profile photo and clinic information
   - Set consultation fees and available time slots

2. **Verification Process**:
   - Upload medical license and degree certificates
   - Submit specialty certifications
   - Track verification status

3. **Location Management**:
   - Set clinic address with Google Maps integration
   - Enable patients to get directions
   - Update location information as needed

## 🔒 Security Features

- **Role-based Authentication**: Separate access levels for patients and doctors
- **Document Verification**: Secure upload and verification of medical credentials
- **Data Validation**: Input validation and sanitization
- **Secure Storage**: Local storage for session management

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with advanced filtering
- **Tablet**: Optimized layout with touch-friendly controls
- **Mobile**: Streamlined interface with essential features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues:

1. **Port Already in Use**:
   ```bash
   Error: Port 5173 is already in use
   ```
   Solution: Kill the process using the port or use a different port:
   ```bash
   npm run dev -- --port 3000
   ```

2. **Node Modules Issues**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Build Errors**:
   ```bash
   npm run lint
   npm run build
   ```

### Getting Help:

- Check the browser console for error messages
- Ensure all dependencies are installed correctly
- Verify Node.js version compatibility
- Clear browser cache if experiencing display issues

## 🔮 Future Enhancements

- **Real-time Chat**: Patient-doctor communication
- **Payment Integration**: Online payment processing
- **Notification System**: Email and SMS notifications
- **Telemedicine**: Video consultation capabilities
- **Electronic Health Records**: Patient health history management
- **Multi-language Support**: Internationalization
- **Advanced Analytics**: Reporting and insights dashboard

---

**Built with ❤️ for better healthcare accessibility**