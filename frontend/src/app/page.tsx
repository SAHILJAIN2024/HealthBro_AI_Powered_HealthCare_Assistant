"use client";

import { getAuth } from "firebase/auth";
import { app } from "../utils/firebase";
import SignupPage from "./signup/page";
// import "../globals.css"; // fixed global.css import

const auth = getAuth(app);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 bg-gray-50">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">Welcome to HealthBro</h1>
      <p className="text-gray-600 mb-10 text-center max-w-md">
        Your AI-powered health companion for smart triage, risk prediction, and real-time doctor support.
      </p>
      <SignupPage />
    </main>
  );
}
