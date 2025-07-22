"use client";

import SymptomsChecker from "@/components/SymptomsChecker";
import RiskPredictor from "@/components/RiskPredictor";
import Signup from "@/components/Signup";
import Prescription from "@/components/Prescription";
import MedicalHistory from "../../../components/MedicalHistory";


export default function PatientDashboard(){
    return(
        <>
        <MedicalHistory />
        <SymptomsChecker />
        <RiskPredictor />
        </>
    )
}