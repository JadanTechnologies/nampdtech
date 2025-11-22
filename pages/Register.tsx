
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_STATES } from '../services/mockData';
import { Upload, ScanLine, Loader, ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    state: 'Lagos',
    businessName: '',
    businessAddress: '',
    ninNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleScanNIN = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanError(null);
    
    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64Content = base64Data.split(',')[1];
      
      // Initialize Gemini
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Call the model
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            { inlineData: { mimeType: file.type, data: base64Content } },
            { text: "Analyze this image of an ID card. Extract the 'Surname' and 'First Name' and combine them into a single 'fullName' string. Extract the National Identification Number as 'ninNumber'. Return strictly valid JSON with keys: 'fullName' and 'ninNumber'. If a field is not found, return an empty string." }
          ]
        },
        config: {
            responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (text) {
        const result = JSON.parse(text);
        setFormData(prev => ({
            ...prev,
            fullName: result.fullName || prev.fullName,
            ninNumber: result.ninNumber || prev.ninNumber
        }));
      }
    } catch (error) {
      console.error("OCR Error:", error);
      setScanError("Could not extract data automatically. Please fill form manually.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
       if (formData.password !== formData.confirmPassword) {
           alert("Passwords do not match");
           return;
       }
       setStep(2);
    } else {
      // Submit registration
      // Exclude password/confirm from profile data
      const { password, confirmPassword, ...profileData } = formData;
      register(profileData);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
       <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Join NAMPDTech</h2>
        <p className="text-center text-sm text-gray-500 mt-2">
          Member Registration - Step {step} of 2
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {/* Scan Banner for Step 2 */}
          {step === 2 && (
              <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                  <div className="flex items-start">
                      <div className="flex-shrink-0">
                          {isScanning ? <Loader className="h-6 w-6 text-indigo-600 animate-spin" /> : <ScanLine className="h-6 w-6 text-indigo-600" />}
                      </div>
                      <div className="ml-3 w-full">
                          <h3 className="text-sm font-medium text-indigo-800">Auto-fill from NIN Slip</h3>
                          <div className="mt-2">
                              <label className="inline-flex items-center px-3 py-2 border border-indigo-300 shadow-sm text-sm leading-4 font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 cursor-pointer">
                                  <Upload className="h-4 w-4 mr-2" />
                                  {isScanning ? "Analyzing..." : "Upload Slip Image"}
                                  <input type="file" accept="image/*" className="hidden" onChange={handleScanNIN} disabled={isScanning} />
                              </label>
                          </div>
                          {scanError && <p className="mt-2 text-xs text-red-600 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> {scanError}</p>}
                      </div>
                  </div>
              </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {step === 1 && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email address</label>
                        <input name="email" type="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input name="password" type="password" required value={formData.password} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <button type="submit" className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                        Next Step <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                </>
            )}

            {step === 2 && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input name="fullName" type="text" required value={formData.fullName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">State</label>
                            <select name="state" value={formData.state} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500">
                                {MOCK_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">NIN Number</label>
                        <input name="ninNumber" type="text" required value={formData.ninNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Business Name</label>
                        <input name="businessName" type="text" required value={formData.businessName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Business Address</label>
                        <input name="businessAddress" type="text" required value={formData.businessAddress} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    <div className="flex space-x-3">
                        <button type="button" onClick={() => setStep(1)} className="flex-1 flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </button>
                        <button type="submit" className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                            Complete Registration <Check className="ml-2 h-4 w-4" />
                        </button>
                    </div>
                </>
            )}

          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Already have an account?</span></div>
            </div>
            <div className="mt-6 text-center">
               <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in instead</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
