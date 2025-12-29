import React from "react";

const cars = [
  {
    id: 1,
    title: "Rolls Royce Wraith",
    image: "/img/rrpro.jpg",
    logo: "/img/rrlogo.png",
    price: "2500",
    specs: [
      { icon: "/icons/v12.svg", label: "V12" },
      { icon: "/icons/hp.svg", label: "630 HP" },
      { icon: "/icons/engine.svg", label: "6.6L" },
    ],
    features: [
      "Free Delivery",
      "250 km/day, Extra charges for excess km",
      "Free cancellation within 24 hours",
      "VIP airport pickup, premium service, special requests",
    ],
  },

  // Add more car objects here if needed

  {
    id: 2,
    title: "Rolls Royce Wraith",
    image: "/img/rrpro.jpg",
    logo: "/img/rrlogo.png",
    price: "2500",
    specs: [
      { icon: "/icons/v12.svg", label: "V12" },
      { icon: "/icons/hp.svg", label: "630 HP" },
      { icon: "/icons/engine.svg", label: "6.6L" },
    ],
    features: [
      "Free Delivery",
      "250 km/day, Extra charges for excess km",
      "Free cancellation within 24 hours",
      "VIP airport pickup, premium service, special requests",
    ],
  },

  // Add more car objects here if needed

  {
    id: 3,
    title: "Rolls Royce Wraith",
    image: "/img/rrpro.jpg",
    logo: "/img/rrlogo.png",
    price: "2500",
    specs: [
      { icon: "/icons/v12.svg", label: "V12" },
      { icon: "/icons/hp.svg", label: "630 HP" },
      { icon: "/icons/engine.svg", label: "6.6L" },
    ],
    features: [
      "Free Delivery",
      "250 km/day, Extra charges for excess km",
      "Free cancellation within 24 hours",
      "VIP airport pickup, premium service, special requests",
    ],
  }

  // Add more car objects here if needed

];

export default function CarCollection() {
  return (
    <div className="bg-[#0E0E0E] min-h-screen text-white py-12 px-4 md:px-16">
      <div className="text-center mb-12">
        <h2 className="font-bruno text-4xl md:text-5xl font-bold tracking-wide  text-white mb-4">
          OUR COLLECTION CARS
        </h2>
        <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base leading-relaxed">
          Get your dream car with the settings of your choice. There are many interesting
          offers through our cooperation with various trusted leasing partners.
        </p>
      </div>

      <div className="space-y-10">
        {cars.map((car) => (
          <div
            key={car.id}
            className="relative flex flex-col md:flex-row items-center bg-[#1A1A1A] rounded-xl overflow-hidden shadow-lg"
          >
            <div className="md:w-1/3 w-full">
              <img
                src={car.image}
                alt={car.title}
                className="w-4/4 h-4/4 object-cover"
              />
            </div>

             {/* car spec */}

            <div className="bg-gray-800 items-center flex flex-col">

               <img className=" absolute  h-10 w-13 top-7" src={car.logo} alt="" />

               <div className="h-2/3 items-center space-x-6 mb-4">
                {car.specs.map((spec, index) => (
                  <div key={index} className="flex flex-col items-center text-sm">
                    <img src={spec.icon} alt="spec icon" className="h-6 mb-1" />
                    <span>{spec.label}</span>
                  </div>
                ))}
              </div>

            </div>

            <div className="md:w-[40%] w-full ml-24 p-6 md:p-10">
              <div className="flex items-center space-x-4 mb-4">
               
                <h3 className="text-2xl md:text-3xl font-bold font-[Orbitron]">
                  {car.title}
                </h3>
              </div>

              

              <ul className="text-sm text-gray-300 space-y-1 mb-6">
                {car.features.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>

              <div className="text-right">
                <span className="text-yellow-400 text-2xl font-bold ">
                  {car.price} $
                </span>
                <span className="text-sm text-gray-400 ml-1">PER DAY</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}