"use client";

import { getAuth } from "firebase/auth";
import { app } from "../utils/firebase";
import LoginSignup from "./LoginSignup/page";

const auth = getAuth(app);

export default function Home() {
  return (
    <main className="w-screen min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-gray-50">
      <h1 className="text-4xl font-bold mb-6 text-blue-700 text-center w-full">
        Welcome to HealthBro
      </h1>
      <p className="text-gray-600 mb-10 text-center w-full max-w-4xl px-4">
        Your AI-powered health companion for smart triage, risk prediction, and real-time doctor support.
      </p>
      <div className="w-full px-2 sm:px-8 md:px-12 lg:px-24">
        <LoginSignup />
      </div>
    </main>
  );
}
