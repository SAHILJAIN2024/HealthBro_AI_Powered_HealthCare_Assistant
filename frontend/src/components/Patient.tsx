import React, { useEffect, useState } from "react";

const getStatusStyle = (status: string) => {
  const base = "px-2 py-1 rounded-full text-xs font-medium ";
  switch (status.toLowerCase()) {
    case "active": return base + "bg-green-100 text-green-800";
    case "follow-up": return base + "bg-yellow-100 text-yellow-800";
    case "new": return base + "bg-blue-100 text-blue-800";
    case "urgent": return base + "bg-red-100 text-red-800";
    case "normal": return base + "bg-green-50 text-green-700";
    default: return base + "bg-gray-100 text-gray-800";
  }
};

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/doctor/patients"); // Adjust endpoint if needed
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-blue-600">Loading patient data...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Patient List</h2>
      {patients.length === 0 ? (
        <p className="text-gray-500">No patients found.</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-blue-50 text-left text-sm text-blue-700">
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Last Visit</th>
              <th className="px-4 py-2 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient: any, idx) => (
              <tr key={idx} className="hover:bg-blue-50 text-sm">
                <td className="px-4 py-2 border-b">{patient.name}</td>
                <td className="px-4 py-2 border-b">{patient.lastVisit}</td>
                <td className="px-4 py-2 border-b">
                  <span className={getStatusStyle(patient.status)}>
                    {patient.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientList;
