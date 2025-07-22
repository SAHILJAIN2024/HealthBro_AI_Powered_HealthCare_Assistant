import React, { useState } from 'react';

interface PatientData {
  id: string;
  age: number;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSaturation: number;
  };
}

const RiskPredictor: React.FC = () => {
  const [patient, setPatient] = useState<PatientData>({
    id: '',
    age: 0,
    vitals: {
      heartRate: 0,
      bloodPressure: '120/80',
      temperature: 37,
      oxygenSaturation: 98
    }
  });
  const [recommendation, setRecommendation] = useState<string>('');
  const [quickSolution, setQuickSolution] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'id' || name === 'age') {
      setPatient(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value) || 0 : value }));
    } else {
      setPatient(prev => ({
        ...prev,
        vitals: {
          ...prev.vitals,
          [name]: name === 'temperature' || name === 'heartRate' || name === 'oxygenSaturation' 
            ? parseFloat(value) || 0 
            : value
        }
      }));
    }
  };

  const assessRisk = () => {
    const { vitals } = patient;
    const [systolic, diastolic] = vitals.bloodPressure.split('/').map(Number);

    if (vitals.oxygenSaturation < 90) {
      setRecommendation('Immediate medical attention required - low oxygen saturation');
      setQuickSolution('Administer supplemental oxygen if available');
    } else if (systolic > 180 || diastolic > 120) {
      setRecommendation('Urgent care needed - hypertensive crisis');
      setQuickSolution('Have patient sit quietly, monitor closely');
    } else if (vitals.heartRate > 120) {
      setRecommendation('Medical evaluation recommended - tachycardia');
      setQuickSolution('Have patient rest, check for other symptoms');
    } else if (vitals.temperature > 38.5) {
      setRecommendation('Monitor closely - fever present');
      setQuickSolution('Administer antipyretics if appropriate, keep hydrated');
    } else {
      setRecommendation('Vitals within normal range - routine monitoring');
      setQuickSolution('Continue regular observation');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Patient Risk Assessment</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID:</label>
              <input
                type="text"
                name="id"
                value={patient.id}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter patient ID"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age:</label>
              <input
                type="number"
                name="age"
                value={patient.age}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter age"
              />
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Vitals</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm):</label>
                <input
                  type="number"
                  name="heartRate"
                  value={patient.vitals.heartRate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter heart rate"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure (mmHg):</label>
                <input
                  type="text"
                  name="bloodPressure"
                  value={patient.vitals.bloodPressure}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter blood pressure (e.g., 120/80)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C):</label>
                <input
                  type="number"
                  name="temperature"
                  value={patient.vitals.temperature}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter temperature"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oxygen Saturation (%):</label>
                <input
                  type="number"
                  name="oxygenSaturation"
                  value={patient.vitals.oxygenSaturation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter oxygen saturation"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={assessRisk}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Assess Risk
            </button>
          </div>
          
          {recommendation && (
            <div className="mt-8 space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Recommended Action:</h3>
                <p className="text-blue-700">{recommendation}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-800 mb-2">Quick Solution:</h3>
                <p className="text-green-700">{quickSolution}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskPredictor;