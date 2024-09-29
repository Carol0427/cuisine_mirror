"use client";
import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

const Menus = [
  { title: "Dashboard", src: "Chart_fill", href: "/Dashboard" },
  { title: "Account", src: "User", href: "/Account" },
  // { title: "Logout", src: "LogOut", href: "/LogOut" },
];

export default function Nav({ isMobile }) {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navClasses = `fixed top-0 left-0 h-screen bg-[#02254D] transition-all duration-300 ease-in-out z-50
        ${
          isMobile
            ? isOpen
              ? "w-60"
              : "w-0 -left-full"
            : isOpen
            ? "w-52"
            : "w-20"
        }`;

  return (
    <nav className={navClasses}>
      {isMobile && (
        <div className="h-16 flex items-center px-4">
          <button
            onClick={toggleMenu}
            className="text-white bg-zinc-700 p-2 rounded-md"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>
      )}

      <div className="h-[calc(100%-4rem)] overflow-y-auto">
        <ul className="pt-4">
          {user && (
            <li className="flex items-center px-4 py-2 mb-4 text-gray-300">
              <img
                src={user.picture}
                className="w-12 h-12 rounded-full"
                alt="User profile"
              />
              {isOpen && <span className="ml-4 text-lg">Profile</span>}
            </li>
          )}
          {Menus.map((menu, index) => (
            <li key={index}>
              <Link
                href={menu.href}
                className="flex items-center px-4 py-2 mt-4 text-gray-300 cursor-pointer hover:bg-zinc-500"
              >
                <img
                  className="w-12 h-12"
                  src={`https://cdn-icons-png.flaticon.com/128/739/739249.png`}
                  alt={menu.title}
                />
                {isOpen && <span className="ml-4 text-lg">{menu.title}</span>}
              </Link>
            </li>
          ))}
          {user && (
            <li>
              <Link
                href="/api/auth/logout"
                className="flex items-center px-4 py-2 mt-4 text-gray-300 cursor-pointer hover:bg-zinc-500"
              >
                <img
                  className="w-12 h-12"
                  src={`https://cdn-icons-png.flaticon.com/128/739/739249.png`}
                  alt="Logout"
                />
                {isOpen && <span className="ml-4 text-lg">Logout</span>}
              </Link>
            </li>
          )}
        </ul>
      </div>

      {!isMobile && (
        <button
          onClick={toggleMenu}
          className="absolute -right-5 top-16 bg-zinc-600 rounded-full p-2"
        >
          {isOpen ? "◀" : "▶"}
        </button>
      )}
    </nav>
  );
}
