"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";

const EmergencyComponent: React.FC = () => {
  const [doctorEmail, setDoctorEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        setUid(user.email); // 🔁 using patient email as patientId
      } else {
        setUid(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSendAlert = async () => {
    if (!uid || !doctorEmail.trim()) {
      alert("❗ Please provide both doctor email and be logged in as a patient.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        patientId: uid,
        doctorEmail,
      };

      const res = await fetch("http://localhost:5000/api/emergency/alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Alert failed");

      alert("✅ " + data.message);
    } catch (error: any) {
      alert("❌ Failed to send alert: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4 text-red-700">🚨 Emergency Alert</h2>

      <input
        type="email"
        placeholder="Doctor's Email"
        value={doctorEmail}
        onChange={(e) => setDoctorEmail(e.target.value)}
        className="border border-gray-300 p-2 w-full mb-4 rounded"
      />

      <button
        onClick={handleSendAlert}
        disabled={loading}
        className={`w-full py-2 rounded text-white ${
          loading ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {loading ? "Sending..." : "Send Emergency Alert"}
      </button>
    </div>
  );
};

export default EmergencyComponent;
