"use client";

import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { User, Mail, Loader } from "lucide-react";

export default function Account() {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-100">
        <Loader className="w-12 h-12 text-green-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-100">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    user && (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                className="h-48 w-full object-cover md:w-48"
                src={user.picture}
                alt={user.name}
              />
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-green-600 font-semibold mb-1">
                Account Information
              </div>
              <h2 className="block mt-1 text-lg leading-tight font-medium text-black">
                {user.name}
              </h2>
              <div className="mt-4 flex items-center text-gray-600">
                <User className="h-5 w-5 mr-2" />
                <p>{user.nickname || "No nickname set"}</p>
              </div>
              <div className="mt-2 flex items-center text-gray-600">
                <Mail className="h-5 w-5 mr-2" />
                <p>{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
