"use client";
import Prescription from "@/components/Prescription";

export default function prescriptions() {
    return(
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-blue-800 mb-8">Prescriptions</h1>
            <Prescription />
        </div>
    )
}