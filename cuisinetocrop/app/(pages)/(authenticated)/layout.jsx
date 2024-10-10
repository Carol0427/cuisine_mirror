"use client";
import { useState, useEffect } from "react";
import Nav from "./nav.jsx";

export default function DashboardLayout({ children }) {
	const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="flex h-screen w-screen overflow-hidden">
			<Nav isMobile={isMobile} />
			<main
				className={`flex-grow overflow-y-auto z-0 ${
					isMobile ? "" : "ml-20"
				}`}
			>
				{children}
			</main>
		</div>
	);
}
