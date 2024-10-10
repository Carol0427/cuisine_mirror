"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const { user, error, isLoading: userLoading } = useUser();
  const [items, setItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const initializeDashboard = async () => {
      if (!user) return;

      try {
        const userResponse = await fetch("/api/CheckUser");
        const userData = await userResponse.json();

        if (userResponse.status === 404 || !userData.exists) {
          router.push("/NewUser");
          return;
        }

        const userID = user.sub;
        const itemsResponse = await fetch(`/api/GetItems?userID=${userID}`);
        const itemsData = await itemsResponse.json();

        if (itemsResponse.ok) {
          setItems(itemsData);
        } else {
          console.error("Failed to fetch items:", itemsData);
        }
      } catch (err) {
        console.error("Error initializing dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading) {
      initializeDashboard();
    }
  }, [user, userLoading, router]);

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error.message}</div>;
  }

  return (
    userLoading || loading ? (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#40C9A2] mx-auto"></div>
          <span className="block mt-4 text-xl text-[#40C9A2]">Loading...</span>
        </div>
      </div>
    ) : (
      <div className="w-full p-8 bg-[#f2e8cf]">
        <h1 className="text-3xl font-bold text-[#386641] md:text-left text-center w-full pb-4">DASHBOARD</h1>
        {items.length === 0 ? (
          <p className="text-center text-gray-500">No items found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <Link href={`/ItemDetails/${item.itemID}/${encodeURIComponent(item.title)}/${encodeURIComponent(item.description)}`} key={item.itemID}>
                <div className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow duration-300 cursor-pointer">
                  <h2 className="text-xl font-bold text-[#02254D]">{item.title}</h2>
                  <p className="text-gray-600 mt-2">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  );
}