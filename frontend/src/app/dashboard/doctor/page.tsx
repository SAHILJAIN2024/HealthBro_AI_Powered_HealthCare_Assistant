"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Profile from "@/components/ProfileDoc";
import PatientList from "@/components/Patient";
import Prescription from "@/components/Prescription";
import DoctorNotifications from "@/components/Docnotification";

export default function Doctordashboard() {
  const router = useRouter();
  const [latestData, setLatestData] = useState({
    prescriptions: [] as { name: string; dose: string }[],
    testResults: [] as { type: string; patient: string; status: string }[],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // 🔒 Redirect if not authenticated or not a doctor
    if (!token || role !== "doctor") {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const [ prescriptionsRes, testRes] = await Promise.all([
          fetch("http://localhost:5000/api/doctor/prescriptions", { headers }),
          fetch("http://localhost:5000/api/doctor/tests", { headers }),
        ]);

        const prescriptions = await prescriptionsRes.json();
        const testResults = await testRes.json();

        setLatestData({
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
  <div className="min-h-screen bg-gray-50 p-6">
    <h1 className="text-3xl font-bold text-blue-900 mb-8">Doctor Dashboard</h1>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* Profile */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
        <Profile/>
      </div>

      {/* Patients Card */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
        <PatientList />
      </div>
        

      {/* Prescription Card */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
        <Prescription/>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
        <DoctorNotifications />
      </div>

    </div>
  </div>
);
}
