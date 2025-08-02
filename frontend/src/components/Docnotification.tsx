"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

type Alert = {
  _id?: string;
  patientId: string;
  medicalHistory: any;
  createdAt: string;
};

const DoctorNotifications = () => {
  const [notifications, setNotifications] = useState<Alert[]>([]);
  const [doctorEmail, setDoctorEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        const email = user.email;
        setDoctorEmail(email);
        socket.emit("join_room", email);

        fetch(`http://localhost:5000/api/emergency/alerts/${email}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.alerts) {
              setNotifications(data.alerts);
            }
          })
          .catch((err) => {
            console.error("❌ Error fetching alerts:", err.message);
          });

        socket.on("emergencyAlert", (newAlert: Alert) => {
          setNotifications((prev) => [newAlert, ...prev]);
        });
      }
    });

    return () => {
      socket.off("emergencyAlert");
      socket.disconnect();
      unsubscribe();
    };
  }, []);

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/emergency/alert/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");

      // Remove from local state
      setNotifications((prev) => prev.filter((alert) => alert._id !== id));
    } catch (err: any) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-red-700">🚨 Emergency Alerts</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-600">No alerts yet.</p>
      ) : (
        notifications.map((note) => (
          <div
            key={note._id}
            className="bg-white p-4 mb-3 rounded shadow border border-red-300"
          >
            <p><strong>👤 Patient Email:</strong> {note.patientId}</p>
            <p><strong>📚 Medical History:</strong></p>
            <pre className="bg-gray-50 text-sm p-2 rounded overflow-auto">
              {typeof note.medicalHistory === "string"
                ? note.medicalHistory
                : JSON.stringify(note.medicalHistory, null, 2)}
            </pre>
            <p className="text-sm text-gray-500 mt-1">
              ⏰ {new Date(note.createdAt).toLocaleString()}
            </p>
            <button
              onClick={() => handleDelete(note._id)}
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default DoctorNotifications;
