"use client";

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase'; // Adjust path as needed

interface SymptomCheck {
  _id?: string;
  uid?: string;
  symptoms: string[];
  severity: string;
  doctorsuggestion: string;
  createdAt: string;
} 

const SymptomsChecker: React.FC = () => {
  const [symptomChecks, setSymptomChecks] = useState<SymptomCheck[]>([]);
  const [newSymptom, setNewSymptom] = useState<string>('');
  const [currentSymptoms, setCurrentSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uid, setUid] = useState<string | null>(null);

  // 🔐 Get the current user's Firebase UID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // 🔁 Fetch previous predictions from backend
  useEffect(() => {
    if (!uid) return;

    const fetchPredictions = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/predictions/${uid}`);
        if (!res.ok) throw new Error("Failed to load predictions");
        const data = await res.json();
        setSymptomChecks(data);
      } catch (error) {
        console.warn("Error loading predictions:", error);
        setSymptomChecks([]);
      }
    };

    fetchPredictions();
  }, [uid]);

  const addSymptom = () => {
    if (newSymptom.trim() && !currentSymptoms.includes(newSymptom.trim())) {
      setCurrentSymptoms([...currentSymptoms, newSymptom.trim()]);
      setNewSymptom('');
    }
  };

  const removeSymptom = (symptomToRemove: string) => {
    setCurrentSymptoms(currentSymptoms.filter(symptom => symptom !== symptomToRemove));
  };

  const analyzeSymptoms = async () => {
    if (currentSymptoms.length === 0 || !uid) return;

    setLoading(true);
    try {
      const inputText = currentSymptoms.join(', ');
      const mode = "structured";

      const res = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input_text: inputText, mode, uid }),
      });

      if (!res.ok) throw new Error("Prediction failed");

      const { savedPrediction } = await res.json();

      setSymptomChecks([savedPrediction, ...symptomChecks]);
      setCurrentSymptoms([]);
    } catch (error) {
      alert("Symptom analysis failed. Please try again.");
      console.error("Error analyzing symptoms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;

    const confirmed = window.confirm("Are you sure you want to delete this prediction?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/predictions/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error("Failed to delete prediction");

      setSymptomChecks(symptomChecks.filter((check) => check._id !== id));
    } catch (error) {
      console.error("Error deleting prediction:", error);
      alert("Failed to delete prediction. Try again.");
    }
  };


  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Symptoms Checker</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Check Your Symptoms</h2>

        <div className="flex flex-col space-y-4">
          <div>
            <label htmlFor="symptom-input" className="block text-sm font-medium text-gray-700 mb-1">
              Add Symptom
            </label>
            <div className="flex">
              <input
                type="text"
                id="symptom-input"
                className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g. Headache, Fever..."
                value={newSymptom}
                onChange={(e) => setNewSymptom(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSymptom()}
              />
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700"
                onClick={addSymptom}
              >
                Add
              </button>
            </div>
          </div>

          {currentSymptoms.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Current Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {currentSymptoms.map((symptom) => (
                  <span key={symptom} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {symptom}
                    <button
                      type="button"
                      className="ml-1 text-blue-500 hover:text-red-500"
                      onClick={() => removeSymptom(symptom)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={currentSymptoms.length === 0 || loading || !uid}
            className="inline-flex justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
            onClick={analyzeSymptoms}
          >
            {loading ? 'Analyzing...' : 'Analyze Symptoms'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-700">Previous Symptom Checks</h2>
        {symptomChecks.length === 0 ? (
          <p className="text-gray-500">No symptom checks recorded yet.</p>
        ) : (
          symptomChecks.map((check, index) => (
            <div key={check._id || index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Check #{index + 1}</h3>
                  <p className="text-sm text-gray-500">{new Date(check.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${check.severity === 'High' ? 'bg-red-100 text-red-800' :
                      check.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                    }`}>
                    {check.severity} severity
                  </span>
                  <button
                    onClick={() => handleDelete(check._id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>


              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Symptoms</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {check.symptoms.map(symptom => (
                    <li key={symptom} className="text-gray-900">{symptom}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Doctor's Suggestion</h4>
                <div className="bg-blue-50 p-4 rounded-md text-blue-800">
                  {check.doctorsuggestion}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SymptomsChecker;
