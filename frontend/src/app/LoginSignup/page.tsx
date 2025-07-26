"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { auth, db } from "../../utils/firebase";
import { useRouter } from "next/navigation";
import firebase from "firebase/compat/app";

const LoginSignup: React.FC = () => {
  const router = useRouter();

  // UI States
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");

  // Form Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");

  // 🔐 Handle Sign Up
  const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage("");

  try {
    console.log("🟣 Creating Firebase Auth user...");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userID = user.uid;
    const token = await user.getIdToken();

    console.log("✅ Auth user created:", userID);

    const userData = {
      uid: userID,
      email,
      name,
      phone,
      gender,
      age,
      role,
      createdAt: new Date().toISOString(),
    };

    console.log("🟢 Saving to Firebase DB...");
    await set(ref(db, `users/${userID}`), userData);
    console.log("✅ Saved to Firebase DB");

    console.log("🌍 Saving to MongoDB...");
    const res = await fetch("http://localhost:5000/api/user/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error("MongoDB storage failed: " + text);
    }

    console.log("✅ Saved to MongoDB");

    setMessage("✅ Account created successfully!");
    // Comment this out to confirm success message shows:
    // setIsSignup(false);
  } catch (error: any) {
    console.error("❌ Signup Error:", error);
    setMessage(`❌ ${error.message}`);
  }
};



  // 🔐 Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      console.log("📥 Signing in...");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userID = user.uid;
      console.log("✅ Firebase Auth success:", userID);

      const token = await user.getIdToken();
      console.log("🔑 Got ID token:", token.slice(0, 10) + "...");

      // 🔎 Fetch Firebase profile
      const snapshot = await get(ref(db, `users/${userID}`));
      if (!snapshot.exists()) throw new Error("User profile not found in Firebase");
      const userProfile = snapshot.val();
      console.log("📄 Firebase profile:", userProfile);

      const role = userProfile.role;

      // 🌐 Fetch MongoDB profile
      const res = await fetch("http://localhost:5000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error("MongoDB fetch failed: " + errText);
      }

      const { profile } = await res.json();
      console.log("🌍 MongoDB profile:", profile);

      // 🧠 Store locally
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      localStorage.setItem("mongoProfile", JSON.stringify(profile));

      setMessage("✅ Login successful!");
      router.push(role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient");
    } catch (error: any) {
      console.error("❌ Login failed:", error.message);
      setMessage(`❌ ${error.message}`);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white px-4">
      <div className="relative w-full max-w-full h-[700px] bg-white rounded-3xl overflow-hidden shadow-lg flex">

        {/* Sign In Panel */}
        <div className={`w-1/2 p-10 transition-all duration-700 ${isSignup ? "-translate-x-full opacity-0 absolute" : "relative opacity-100"}`}>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign In</h2>
          <form className="space-y-4" onSubmit={handleLogin}>
            <Input label="Email" type="email" value={email} onChange={setEmail} />
            <Input label="Password" type="password" value={password} onChange={setPassword} />
            <Select label="Role" value={role} onChange={setRole} options={["patient", "doctor"]} />
            <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700">Sign In</button>
            {message && <p className="absolute bottom-4 text-sm text-center text-purple-700">{message}</p>}
          </form>
        </div>

        {/* Sign Up Panel */}
        <div className={`w-1/2 p-10 transition-all duration-700 ${isSignup ? "relative opacity-100" : "translate-x-full opacity-0 absolute"}`}>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign Up</h2>
          <form className="space-y-2" onSubmit={handleSignup}>
            <Input label="Full Name" type="text" value={name} onChange={setName} />
            <Input label="Phone Number" type="tel" value={phone} onChange={setPhone} />
            <Select label="Gender" value={gender} onChange={setGender} options={["", "male", "female", "other"]} />
            <Input label="Age" type="number" value={age} onChange={setAge} />
            <Input label="Email" type="email" value={email} onChange={setEmail} />
            <Input label="Password" type="password" value={password} onChange={setPassword} />
            <Select label="Role" value={role} onChange={setRole} options={["patient", "doctor"]} />
            <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700">Sign Up</button>
            {message && <p className="absolute bottom-4 text-sm text-center text-purple-700">{message}</p>}
          </form>
        </div>

        {/* Overlay Panel */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-purple-600 to-purple-700 text-white flex flex-col justify-center items-center p-10 transition-all duration-700 z-10 rounded-l-[3rem]">
          <h2 className="text-3xl font-bold mb-4">{isSignup ? "Welcome Back!" : "Hello, Friend!"}</h2>
          <p className="text-center text-sm mb-6 max-w-xs">
            {isSignup ? "To stay connected, please log in with your credentials" : "Register with your details to access all features"}
          </p>
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-purple-700 transition"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

// 🔧 Reusable Input component
const Input = ({
  label,
  type,
  value,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (val: string) => void;
}) => (
  <div className="flex flex-col space-y-1">
    <label>{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border rounded-md"
      required
    />
  </div>
);

// 🔧 Reusable Select component
const Select = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}) => (
  <div className="flex flex-col space-y-1">
    <label>{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border rounded-md"
      required
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt === "" ? "Select" : opt.charAt(0).toUpperCase() + opt.slice(1)}
        </option>
      ))}
    </select>
  </div>
);

export default LoginSignup;
