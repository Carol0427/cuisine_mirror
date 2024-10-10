import React from "react";
import { ArrowRight, Sprout, Utensils, TrendingUp } from "lucide-react";
import Link from "next/link";

const CuisineToCropHomepage = () => {
  return (
    <div className="bg-[#f2e8cf] min-h-screen">
      <header className="bg-gradient-to-r from-green-800 to-green-700 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold animate-fade-in-down">
            CuisineToCrop
          </h1>
          <p className="mt-3 text-2xl font-light animate-fade-in-up">
            Connecting Farmers and Businesses
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="mb-20 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-6 text-green-800">
            Our Mission
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            CuisineToCrop is a revolutionary platform connecting local farmers
            with businesses, promoting sustainable agriculture and farm-fresh
            ingredients. Our mission is to empower farmers and support local
            economies while providing high-quality produce to restaurants and
            food businesses.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-12 mb-20">
          <FeatureCard
            icon={<Sprout className="w-16 h-16 text-green-600" />}
            title="Sustainable Agriculture"
            description="Support eco-friendly farming practices and reduce food miles."
          />
          <FeatureCard
            icon={<Utensils className="w-16 h-16 text-green-600" />}
            title="Farm-Fresh Ingredients"
            description="Access high-quality, locally sourced produce for your culinary needs."
          />
          <FeatureCard
            icon={<TrendingUp className="w-16 h-16 text-green-600" />}
            title="Empower Local Economies"
            description="Boost local farmers and strengthen community ties."
          />
        </section>

        <section className="text-center">
          <h2 className="text-4xl font-semibold mb-8 text-green-800">
            Join the Movement
          </h2>
          <Link href="/Dashboard">
            <button className="bg-green-600 text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-green-700 transition-colors duration-300 transform hover:scale-105 flex items-center mx-auto shadow-lg">
              Get Started
              <ArrowRight className="ml-2 w-6 h-6" />
            </button>
          </Link>
        </section>
      </main>

      <footer className="bg-gradient-to-r from-green-800 to-green-700 text-white py-10 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg">
            &copy; 2024 CuisineToCrop. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
      <div className="mb-6 flex justify-center">{icon}</div>
      <h3 className="text-2xl font-semibold mb-4 text-green-800">{title}</h3>
      <p className="text-gray-600 text-lg">{description}</p>
    </div>
  );
};

// Add these custom animations to your global CSS file
const customAnimations = `
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fadeInDown 1s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 1s ease-out;
}
`;

export default CuisineToCropHomepage;
