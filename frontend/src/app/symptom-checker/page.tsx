"use client";
import SymptomChecker from "@/components/SymptomsChecker";

export default function SymptomCheckerPage() {
    return(
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-blue-800 mb-8">Symptom Checker</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <SymptomChecker />
            </div>
        </div>

    )
}