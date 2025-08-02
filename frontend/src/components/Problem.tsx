"use client";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";

type Prescription = {
  _id: string;
  email: string;
  name?: string;
  transcription: string;
  createdAt?: string;
};

export default function PatientReports() {
  const [email, setEmail] = useState<string | null>(null);
  const [reports, setReports] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        setEmail(user.email);
      } else {
        setEmail(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!email) return;

    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/prescriptions?email=${encodeURIComponent(email)}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch reports");
        }

        setReports(data);
      } catch (err: any) {
        console.error("❌ Error fetching reports:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [email]);

  if (loading) return <p className="p-4">Loading reports...</p>;
  if (!email) return <p className="p-4">Please log in to view your reports.</p>;

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">📄 Your Prescriptions</h1>

      {reports.length === 0 ? (
        <p className="text-gray-600">No reports found.</p>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="bg-white p-4 rounded-lg shadow border">
              <div className="flex justify-between mb-2 text-sm text-gray-500">
                <span>Doctor: {report.name || "Unknown"}</span>
                <span>{new Date(report.createdAt || "").toLocaleString()}</span>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">
                {report.transcription}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
