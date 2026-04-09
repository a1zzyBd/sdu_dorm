export const DetailsSection = () => (
  <section id="contacts" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
    <div className="grid md:grid-cols-2 gap-8 md:gap-16 text-[#2C3E50] text-xs">
      <div>
        <h3 className="font-serif text-5xl font-bold mb-8 inline-block relative">
            Payment Details
            <span className="absolute left-0 -bottom-3 w-full h-1 bg-[#ED9A71]"></span>
        </h3>
        <div className="space-y-4 text-lg">
          <p>TOO "Dorm-service" 040900,<br />Almatinskaya oblast, Kaskelen, gh Abylai nana, 1/1<br />BIIN: 110440007546,<br />IBAN: KZ436017211000008522<br />BIK: HSBKKZKX<br />Kbe 17<br />AO "Narodnyi Bank Kazakhstana"</p>
          <p>TOO "Dorm-service" 040900,<br />Almatinskaya oblast, Kaskelen, gh Abylai Khan st. 1/1,<br />BIIN: 110440007546,<br />IBAN: KZ166017211000008522<br />BIK: HSBKKZKX<br />Kbe 17<br />AO "National Bank of Kazakhstan"</p>
        </div>
      </div>
      <div>
        <h3 className="font-serif text-5xl font-bold mb-8 inline-block relative">
            Docs required
            <span className="absolute left-0 -bottom-3 w-full h-1 bg-[#ED9A71]"></span>
        </h3>
        <ul className="space-y-1 list-disc list-inside text-lg">
          <li>4 photos 3x4</li>
          <li>Copy of medical report 075<br />(obtainable from any Kazakh clinic)</li>
          <li>Copy of identity card</li>
          <li>Copy of payment receipt</li>
        </ul>
      </div>
    </div>
  </section>
);
