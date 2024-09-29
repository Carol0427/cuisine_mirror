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
    if (!userLoading && user) {
      const checkUserExists = async () => {
        try {
          const response = await fetch("/api/CheckUser");
          const data = await response.json();

          if (response.status === 404 || !data.exists) {
            router.push("/NewUser");
          } else {
            setLoading(false);
          }
        } catch (err) {
          console.error("Error checking user existence:", err);
          setLoading(false);
        }
      };
      
      const getItems = async () => {
        try {
          const userID = user.sub;
          const response = await fetch(`/api/GetItems?userID=${userID}`);
          const itemsData = await response.json();
          if (response.ok) {
            setItems(itemsData);
          } else {
            console.error("Failed to fetch items:", itemsData);
          }
        } catch (err) {
          console.error("Error fetching items:", err);
        } finally {
          setLoading(false);
        }
      };

      checkUserExists();
      getItems();
    }
  }, [user, userLoading, router]);

  if (userLoading || loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="w-full p-8 mt-16 bg-[#E5F9E0]">
      <h1 className="text-3xl font-bold mb-6 text-[#02254D]">DASHBOARD</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Link href={`/ItemDetails/${item.itemID}`} key={item.itemID}>
            <div className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow duration-300 cursor-pointer">
              <h2 className="text-xl font-bold text-[#02254D]">{item.title}</h2>
              <p className="text-gray-600 mt-2">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}