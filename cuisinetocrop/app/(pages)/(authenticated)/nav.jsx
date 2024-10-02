"use client";
import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

const Menus = [
  { title: "Dashboard", src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWxheW91dC1kYXNoYm9hcmQiPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjkiIHg9IjMiIHk9IjMiIHJ4PSIxIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iNSIgeD0iMTQiIHk9IjMiIHJ4PSIxIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iOSIgeD0iMTQiIHk9IjEyIiByeD0iMSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjUiIHg9IjMiIHk9IjE2IiByeD0iMSIvPjwvc3ZnPg==", href: "/Dashboard" },
  { title: "Logout", src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWxvZy1vdXQiPjxwYXRoIGQ9Ik05IDIxSDVhMiAyIDAgMCAxLTItMlY1YTIgMiAwIDAgMSAyLTJoNCIvPjxwb2x5bGluZSBwb2ludHM9IjE2IDE3IDIxIDEyIDE2IDciLz48bGluZSB4MT0iMjEiIHgyPSI5IiB5MT0iMTIiIHkyPSIxMiIvPjwvc3ZnPg==", href: "/api/auth/logout" },
];

export default function Nav({ isMobile }) {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsOpen(false);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const navClasses = `fixed top-0 left-0 h-screen bg-[#a7c957] transition-all duration-300 ease-in-out z-50
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
    <nav className={navClasses} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
            <li className="px-4 py-2 mb-4 text-[#386641]">
              <Link
                href="/Account"
                 className="flex items-center w-full space-x-4"
              >
                <img
                  src={user.picture}
                  className="w-11 h-11 rounded-full"
                  alt="User profile"
                />
                {isOpen && <span className="whitespace-nowrap text-lg">Profile</span>}
              </Link>
            </li>
          )}
          {user && Menus.map((menu, index) => (
            <li key={index}>
              <Link
                href={menu.href}
                className="flex items-center px-4 py-2 mt-4 text-[#386641] cursor-pointer hover:bg-zinc-500 rounded-md"
              >
                <img
                  className="w-9 h-9 flex-shrink-0"
                  src={menu.src}
                  alt={menu.title}
                />
                {isOpen && <span className="ml-4 text-lg whitespace-nowrap">{menu.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}