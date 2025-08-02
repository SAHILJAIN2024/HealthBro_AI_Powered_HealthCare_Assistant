"use client";

import React, { useEffect, useState } from "react";

interface Hospital {
  name: string;
  address: string;
  distance: string;
}

interface Location {
  address: string;
  coordinates?: [number, number];
}

interface MedicalEmergency {
  id: string;
  diseaseProblem: string;
  medication: string;
  duration: string;
  attendedBy: string;
  attendedAt: string | Date;
  reports: string[];
  testResults: string[];
  location: Location;
  nearestHospital: Hospital;
}

const MedicalHistory: React.FC = () => {
  const [emergencies, setEmergencies] = useState<MedicalEmergency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/prescription");
        const data = await res.json();
        setEmergencies(data);
      } catch (error) {
        console.error("Failed to fetch emergency data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencies();
  }, []);

  const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleString();
  };

  if (loading) return <p>Loading medical history...</p>;

  return (
    <div className="medical-history">
      <h2>Medical History</h2>

      {emergencies.length === 0 ? (
        <p className="no-records">No records found</p>
      ) : (
        emergencies.map((emergency) => (
          <div key={emergency.id} className="emergency-record">
            <h3>{emergency.diseaseProblem}</h3>

            <div><strong>Medication:</strong> {emergency.medication}</div>
            <div><strong>Duration:</strong> {emergency.duration}</div>
            <div><strong>Attended By:</strong> {emergency.attendedBy}</div>
            <div><strong>Attended At:</strong> {formatDate(emergency.attendedAt)}</div>

            <div>
              <strong>Reports:</strong>
              <ul>
                {emergency.reports.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>

            <div>
              <strong>Test Results:</strong>
              <ul>
                {emergency.testResults.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>

            <div><strong>Location:</strong> {emergency.location.address}</div>
            <div><strong>Nearest Hospital:</strong> {emergency.nearestHospital.name}, {emergency.nearestHospital.distance}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default MedicalHistory;
