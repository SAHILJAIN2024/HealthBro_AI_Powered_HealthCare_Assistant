
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../utils/firebase";

export default function VoiceNote() {
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState("");
  const [soap, setSoap] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null); // updated

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUpload = async () => {
    if (!file) return alert("📁 Please upload an audio file.");
    const trimmedId = patientId.trim();
    if (!trimmedId) return alert("🆔 Please enter the Patient ID.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("patient_id", trimmedId);
    if (userEmail) formData.append("email", userEmail); // changed from uid to email

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/note/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Upload failed with response:", data);
        throw new Error(data.error || "Upload failed.");
      }

      setTranscript(data.transcript || "");
      setSoap(data.soap_note || null);
    } catch (err: any) {
      alert("⚠️ " + (err.message || "An unexpected error occurred."));
      console.error("Error during upload:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">📝 Voice Note to SOAP</h1>

      <div className="bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto space-y-4">
        <input
          type="text"
          placeholder="Enter Patient ID (e.g. P123)"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="w-full border border-blue-200 p-2 rounded-md focus:outline-none"
        />

        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full"
        />

        <button
          className={`w-full py-2 rounded-md text-white ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "⏳ Processing..." : "📤 Upload & Transcribe"}
        </button>

        {(transcript || soap) && (
          <div className="mt-6 space-y-4">
            {transcript && (
              <div>
                <h2 className="font-semibold text-blue-700">🗣️ Transcript</h2>
                <p className="text-gray-700 bg-gray-100 p-3 rounded-md whitespace-pre-wrap">
                  {transcript}
                </p>
              </div>
            )}

            {soap && (
              <div>
                <h2 className="font-semibold text-blue-700">📋 SOAP Note</h2>
                <ul className="text-sm text-gray-800 bg-gray-50 p-3 rounded-md space-y-1">
                  <li><strong>S:</strong> {soap.subjective || "N/A"}</li>
                  <li><strong>O:</strong> {soap.objective || "N/A"}</li>
                  <li><strong>A:</strong> {soap.assessment || "N/A"}</li>
                  <li><strong>P:</strong> {soap.plan || "N/A"}</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
