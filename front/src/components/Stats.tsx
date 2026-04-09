export const Stats = () => (
  <section className="py-12">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h3 className="text-center text-[#ED9A71] text-4xl mb-6">In every room of the student house there are:</h3>
      <div className="flex w-full">
        <div className="bg-[#2C3E50] grow"></div>
        <div className="bg-[#ED9A71] text-white py-6 px-4 flex-12">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-5xl font-serif">4</p>
              <p className="text-xl">Beds</p>
            </div>
            <div>
              <p className="text-5xl font-serif">2</p>
              <p className="text-xl">Writing desks</p>
            </div>
            <div>
              <p className="text-5xl font-serif">4</p>
              <p className="text-xl">Storage cupboards</p>
            </div>
            <div>
              <p className="text-5xl font-serif">4</p>
              <p className="text-xl">Bookshelves</p>
            </div>
          </div>
        </div>
        <div className="bg-[#2C3E50] grow"></div>
      </div>
    </div>
  </section>
);