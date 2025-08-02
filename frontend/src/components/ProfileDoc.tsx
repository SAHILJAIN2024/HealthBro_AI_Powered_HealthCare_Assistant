"use client";

import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { ref, get } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Problem from "@/components/Problem";
type UserProfile = {
  uid: string;
  email?: string;
  name?: string;
  phone?: string;
  gender?: string;
  age?: number;
  role?: "patient" | "doctor";
  createdAt?: string;
  specialization?: string;
  experienceYears?: string | number;
};

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserData(null);
        setLoading(false);
        return;
      }

      const uid = user.uid;

      try {
        // 1. Try patient path
        const userSnap = await get(ref(db, `users/${uid}`));
        if (userSnap.exists()) {
          setUserData({ ...userSnap.val(), uid, role: "patient" });
        } else {
          // 2. Try doctor path
          const docSnap = await get(ref(db, `doctors/${uid}`));
          if (docSnap.exists()) {
            setUserData({ ...docSnap.val(), uid, role: "doctor" });
          } else {
            setUserData(null);
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!userData) return <p className="p-4">User not logged in or profile not found.</p>;

  const isDoctor = userData.role === "doctor";

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">Profile</h2>
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-700 text-2xl font-bold">
            {userData.name?.charAt(0).toUpperCase() || "U"}
          </span>
        </div>
        <div>
          <p className="font-medium">{userData.name}</p>
          <p className="text-gray-600 text-sm">{userData.email}</p>
          <p className="text-gray-600 text-sm capitalize">{userData.role}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Phone:</span>
          <span className="font-medium">{userData.phone || "N/A"}</span>
        </div>

        {!isDoctor && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-600">Gender:</span>
              <span className="font-medium">{userData.gender || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Age:</span>
              <span className="font-medium">{userData.age || "N/A"}</span>
            </div>
            < Problem />
          </>
        )}

        {isDoctor && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-600">Specialization:</span>
              <span className="font-medium">{userData.specialization || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Experience (Years):</span>
              <span className="font-medium">{userData.experienceYears || "N/A"}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
