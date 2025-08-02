"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Profile from "@/components/ProfileDoc";
import EmergencyComponent from "@/components/EmergencyAlert";
import Problem from "@/components/Problem";

export default function Patientdashboard() {
  const router = useRouter();
  const [latestData, setLatestData] = useState({
    patients: [] as { name: string; lastVisit: string; status: string }[],
    prescriptions: [] as { name: string; dose: string }[],
    testResults: [] as { type: string; patient: string; status: string }[],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // 🔒 Redirect if not authenticated or not a doctor
    if (!token || role !== "patient") {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const [patientsRes, prescriptionsRes, testRes] = await Promise.all([
          fetch("http://localhost:5000/api/doctor/patients"),
          fetch("http://localhost:5000/api/doctor/prescriptions", { headers }),
          fetch("http://localhost:5000/api/doctor/tests", { headers }),
        ]);

        const patients = await patientsRes.json();
        console.log("Fetched patients from backend:", patients);
        const prescriptions = await prescriptionsRes.json();
        const testResults = await testRes.json();


        setLatestData({
          patients: Array.isArray(patients) ? patients : patients.patients || [],
          prescriptions: prescriptions.prescriptions || [],
          testResults: testResults.testResults || [],
        });




      } catch (error) {
        console.error("Failed to fetch doctor dashboard data:", error);
      }
    };

    fetchData();
  }, [router]);

  const getStatusStyle = (status: string) => {
    const base = "px-2 py-1 rounded-full text-xs ";
    switch (status.toLowerCase()) {
      case "active": return base + "bg-green-100 text-green-800";
      case "follow-up": return base + "bg-yellow-100 text-yellow-800";
      case "new": return base + "bg-blue-100 text-blue-800";
      case "urgent": return base + "bg-red-100 text-red-800";
      case "normal": return base + "bg-green-100 text-green-800";
      default: return base + "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-blue-900 text-center mb-10">👩‍⚕️ Patient Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
          <Profile/>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Risk Predictor</h2>
          <div className="mb-4">
            <div className="flex justify-between mb-1"><span className="text-gray-600">Diabetes Risk:</span><span className="font-medium">Medium</span></div>
            <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "60%" }}></div></div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-1"><span className="text-gray-600">Cardiac Risk:</span><span className="font-medium">Low</span></div>
            <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-green-500 h-2.5 rounded-full" style={{ width: "30%" }}></div></div>
          </div>
          <button className="w-full bg-blue-100 text-blue-700 py-2 rounded-md hover:bg-blue-200 transition-colors">
            Assess Risks
          </button>
        </div>

        {/* Emergency Alert */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-red-700 mb-4">Emergency Alert</h2>
          <EmergencyComponent />
        </div>

        {/* Symptom Checker */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Symptom Checker</h2>

          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors" onClick={()=> router.push('/symptom-checker')}>
            Check Symptoms
          </button>
        </div>
      </div>
    </div>
  );
}
