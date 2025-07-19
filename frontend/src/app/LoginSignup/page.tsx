"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../utils/firebase";
import { useRouter } from "next/navigation";

const LoginSignup: React.FC = () => {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role,
      });

      setMessage("✅ Account created successfully!");
      setIsSignup(false);
    } catch (error: any) {
      console.error(error);
      setMessage(`❌ ${error.message}`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(docRef);
      if (!userSnap.exists()) throw new Error("User role not found.");

      const userData = userSnap.data();
      const token = await user.getIdToken();

      localStorage.setItem("token", token);
      localStorage.setItem("role", userData.role);

      setMessage("✅ Login successful!");

      if (userData.role === "doctor") router.push("/dashboard/doctor");
      else router.push("/dashboard/patient");
    } catch (error: any) {
      console.error(error);
      setMessage(`❌ ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white px-4 max-w-full">
      <div className="relative w-full max-w-full h-[500px] bg-white rounded-3xl overflow-hidden shadow-lg flex">

        {/* Sign In Panel */}
        <div className={`w-1/2 p-10 transition-all duration-700 ${isSignup ? "-translate-x-full opacity-0 absolute" : "relative opacity-100"}`}>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign In</h2>

          <p className="text-center text-gray-400 mb-4">or use your email password</p>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="flex flex-col space-y-1">
              <label>Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-md"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label>Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-md"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="text-sm text-purple-500 text-right cursor-pointer hover:underline">Forgot Your Password?</div>
            <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700">Sign In</button>
                  {message && <p className="absolute bottom-4 text-sm text-center text-purple-700">{message}</p>}
          </form>
        </div>

        {/* Sign Up Panel */}
        <div className={`w-1/2 p-10 transition-all duration-700 ${isSignup ? "relative opacity-100" : "translate-x-full opacity-0 absolute"}`}>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign Up</h2>

          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="flex flex-col space-y-1">
              <label>Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-md"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label>Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-md"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label>Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                required
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700">Sign Up</button>
                  {message && <p className="absolute bottom-4 text-sm text-center text-purple-700">{message}</p>}
          </form>
        </div>

        {/* Animated Overlay */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-purple-600 to-purple-700 text-white flex flex-col justify-center items-center p-10 transition-all duration-700 z-10 rounded-l-[3rem]">
          <h2 className="text-3xl font-bold mb-4">{isSignup ? "Welcome Back!" : "Hello, Friend!"}</h2>
          <p className="text-center text-sm mb-6 max-w-xs">
            {isSignup
              ? "To stay connected, please log in with your credentials"
              : "Register with your details to access all features"}
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
}

export default LoginSignup;
