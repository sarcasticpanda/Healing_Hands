import React, { useState } from 'react';
import { Upload, FileText, MapPin, Check, X, AlertCircle, Camera, Map } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'license' | 'degree' | 'certificate' | 'other';
  file: File | null;
  status: 'pending' | 'approved' | 'rejected';
  uploadDate: string;
}

interface DoctorVerificationProps {
  onClose: () => void;
}

const DoctorVerification: React.FC<DoctorVerificationProps> = ({ onClose }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [location, setLocation] = useState({
    address: '',
    coordinates: { lat: 0, lng: 0 },
    mapUrl: '',
  });
  const [isLocating, setIsLocating] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const documentTypes = [
    { value: 'license', label: 'Medical License', required: true },
    { value: 'degree', label: 'Medical Degree', required: true },
    { value: 'certificate', label: 'Specialty Certificate', required: false },
    { value: 'other', label: 'Other Documents', required: false },
  ];

  const handleFileUpload = (files: FileList | null, type: string) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      const newDocument: Document = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: type as Document['type'],
        file,
        status: 'pending',
        uploadDate: new Date().toISOString(),
      };
      setDocuments(prev => [...prev, newDocument]);
    });
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const getCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding to get address (mock implementation)
          const address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          
          setLocation({
            address,
            coordinates: { lat: latitude, lng: longitude },
            mapUrl,
          });
          setIsLocating(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocating(false);
          alert('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      setIsLocating(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files, type);
    }
  };

  const handleSubmit = () => {
    const requiredTypes = documentTypes.filter(type => type.required).map(type => type.value);
    const uploadedTypes = documents.map(doc => doc.type);
    const missingTypes = requiredTypes.filter(type => !uploadedTypes.includes(type));

    if (missingTypes.length > 0) {
      alert(`Please upload required documents: ${missingTypes.join(', ')}`);
      return;
    }

    if (!location.address) {
      alert('Please set your clinic location');
      return;
    }

    // Mock submission
    alert('Verification documents submitted successfully! We will review them within 24-48 hours.');
    onClose();
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'approved':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-theme-card rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-theme-border">
        <div className="flex justify-between items-center p-6 border-b border-theme-border">
          <h2 className="text-2xl font-bold text-theme-text-primary">Doctor Verification</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-theme-hover rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-theme-text-secondary" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Document Upload Section */}
          <div>
            <h3 className="text-xl font-semibold text-theme-text-primary mb-4">Upload Verification Documents</h3>
            <p className="text-theme-text-secondary mb-6">
              Please upload the required documents for verification. All documents should be clear and legible.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {documentTypes.map(docType => (
                <div key={docType.value} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-theme-text-primary">{docType.label}</h4>
                    {docType.required && (
                      <span className="text-red-500 text-sm">*</span>
                    )}
                  </div>

                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragActive
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-theme-border hover:border-blue-300'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={(e) => handleDrop(e, docType.value)}
                  >
                    <Upload className="h-8 w-8 text-theme-text-secondary mx-auto mb-2" />
                    <p className="text-sm text-theme-text-secondary mb-2">
                      Drag & drop files here or click to browse
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e.target.files, docType.value)}
                      className="hidden"
                      id={`file-${docType.value}`}
                    />
                    <label
                      htmlFor={`file-${docType.value}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
                    >
                      Choose Files
                    </label>
                    <p className="text-xs text-theme-text-secondary mt-2">
                      Supported: PDF, JPG, PNG (Max 10MB each)
                    </p>
                  </div>

                  {/* Show uploaded documents for this type */}
                  {documents.filter(doc => doc.type === docType.value).map(doc => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-theme-background rounded-lg border border-theme-border"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-theme-text-secondary" />
                        <div>
                          <p className="text-sm font-medium text-theme-text-primary">{doc.name}</p>
                          <p className="text-xs text-theme-text-secondary">
                            {new Date(doc.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(doc.status)}`}>
                          {getStatusIcon(doc.status)}
                          <span>{doc.status}</span>
                        </span>
                        <button
                          onClick={() => removeDocument(doc.id)}
                          className="p-1 hover:bg-red-100 rounded-full transition-colors"
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Location Section */}
          <div>
            <h3 className="text-xl font-semibold text-theme-text-primary mb-4">Clinic Location</h3>
            <p className="text-theme-text-secondary mb-6">
              Set your clinic location to help patients find you easily.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-theme-text-primary mb-2">
                  Clinic Address
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={location.address}
                    onChange={(e) => setLocation(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter your clinic address"
                    className="flex-1 px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
                  />
                  <button
                    onClick={getCurrentLocation}
                    disabled={isLocating}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>{isLocating ? 'Locating...' : 'Use Current'}</span>
                  </button>
                </div>
              </div>

              {location.coordinates.lat !== 0 && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Location Set</span>
                  </div>
                  <p className="text-sm text-green-700 mb-2">
                    Coordinates: {location.coordinates.lat.toFixed(6)}, {location.coordinates.lng.toFixed(6)}
                  </p>
                  {location.mapUrl && (
                    <a
                      href={location.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Map className="h-4 w-4" />
                      <span>View on Google Maps</span>
                    </a>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-theme-text-primary mb-2">
                  Google Maps URL (Optional)
                </label>
                <input
                  type="url"
                  value={location.mapUrl}
                  onChange={(e) => setLocation(prev => ({ ...prev, mapUrl: e.target.value }))}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
                />
                <p className="text-xs text-theme-text-secondary mt-1">
                  Patients can use this link to get directions to your clinic
                </p>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Verification Process</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Documents will be reviewed within 24-48 hours</li>
              <li>• You'll receive email notifications about the status</li>
              <li>• Verified doctors get a blue checkmark badge</li>
              <li>• Location will be visible to patients for directions</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-theme-border rounded-lg text-theme-text-secondary hover:bg-theme-hover transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Submit for Verification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorVerification;