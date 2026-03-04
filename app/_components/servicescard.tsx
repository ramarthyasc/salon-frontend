
export default function ServicesCard() {
  return (
    <div className="hero-services w-full max-w-4xl bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-lg text-center mx-auto">
      <h2 className="text-3xl font-bold mb-4">Services</h2>
      <p className="mb-8 text-gray-700">
        Discover our comprehensive range of beauty and wellness services.
      </p>

      {/* Service Sections */}
      <div className="space-y-6 text-left">
        {/* Hair Services */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Hair Services</h3>
          <ul className="space-y-2">
            <li>
              <span className="font-medium">Women's Cut & Style</span> - 60 min - From £45
            </li>
            <li>
              <span className="font-medium">Men's Cut</span> - 30 min - From £25
            </li>
          </ul>
        </div>

        {/* Colour Services */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Colour Services</h3>
          <ul className="space-y-2">
            <li>Highlights - 120 min - From £85</li>
            <li>Balayage - 180 min - From £120</li>
            <li>Colour Services - 90 min - From £65</li>
          </ul>
        </div>

        {/* Beauty Services */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Beauty Services</h3>
          <ul className="space-y-2">
            <li>Classic Facial - 60 min - £55</li>
            <li>Luxury Facial - 90 min - £85</li>
            <li>Manicure - 45 min - £28</li>
            <li>Pedicure - 60 min - £35</li>
            <li>Gel Nails - 60 min - £40</li>
          </ul>
        </div>

        {/* Styling & Treatments */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Styling & Treatments</h3>
          <ul className="space-y-2">
            <li>Blow Dry - 45 min - £35</li>
            <li>Hair Treatment - 45 min - £45</li>
            <li>Bridal Hair & Makeup - 120 min - From £150</li>
            <li>Eyelash Extensions - 90 min - £65</li>
          </ul>
        </div>
      </div>

      {/* Booking */}
      <div className="mt-8">
        <p className="mb-4 text-gray-800">
          Ready to book? Book your appointment online or call us at <span className="font-medium">+44 20 1234 5678</span>
        </p>
        <a
          href="#"
          className="inline-block px-6 py-3 bg-pink-200 text-pink-900 font-semibold rounded-lg hover:bg-pink-300 transition"
        >
          Book Now
        </a>
      </div>
    </div>
  );
}
