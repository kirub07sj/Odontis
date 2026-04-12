"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export function UserProfile() {
  const [formData, setFormData] = useState({
    firstName: "Yonathan",
    lastName: "Nega",
    phoneNumber: "0934******65",
    address: "",
    age: "34",
    gender: "Male",
    email: "Yonathan@Example.com",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mt-8">
      <h1 className="text-[20px] font-extrabold text-[#111] mb-6">User Settings</h1>
      
      <div className="bg-white rounded-[24px] p-8 md:p-12 shadow-sm flex flex-col lg:flex-row gap-12 lg:gap-24">
        
        {/* Left Side: Personal Info */}
        <div className="flex-1">
          <h2 className="text-[18px] font-extrabold text-[#111] mb-8">Patient Information</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-500">First Name</label>
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-4 bg-[#fcfcfc] border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all text-[15px] font-bold text-gray-800"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-500">Last Name</label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-4 bg-[#fcfcfc] border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all text-[15px] font-bold text-gray-800"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-500">Phone Number</label>
              <input 
                type="text" 
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-4 bg-[#fcfcfc] border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all text-[15px] font-bold text-gray-800"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-500">Address (Optional)</label>
              <input 
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-4 bg-[#fcfcfc] border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all text-[15px] font-bold text-gray-800"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <label className="block text-sm font-bold text-gray-500">Age</label>
                <input 
                  type="text" 
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full p-4 bg-[#fcfcfc] border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all text-[15px] font-bold text-gray-800"
                />
              </div>
              <div className="flex-1 space-y-2">
                <label className="block text-sm font-bold text-gray-500">Gender</label>
                <input 
                  type="text" 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-4 bg-[#fcfcfc] border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all text-[15px] font-bold text-gray-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Account Credentials & Actions */}
        <div className="w-full lg:w-[400px] flex flex-col items-center">
          {/* Main User Avatar Box */}
          <div className="w-full h-[280px] bg-[#d9d9d9] rounded-xl mb-4"></div>
          
          <h3 className="text-[16px] font-extrabold text-[#111] mb-10 w-full text-center">User ID: 3245</h3>

          <div className="w-full space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#111]">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 bg-[#e5e5e5] border-none rounded-xl outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all text-[15px] font-bold text-[#111]"
              />
            </div>

            <button className="w-full py-4 bg-white border-2 border-gray-100 hover:border-gray-200 text-[#111] rounded-xl font-extrabold text-[15px] shadow-sm transition-colors">
              Change your password
            </button>

            <button className="w-full py-4 bg-[#4a4a4a] hover:bg-[#333333] text-white rounded-xl font-bold text-[15px] shadow-md transition-colors">
              Save & Update
            </button>
            
            <button 
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full py-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-[15px] shadow-sm transition-colors mt-2"
            >
              Sign Out
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
