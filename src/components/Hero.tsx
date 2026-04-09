const slide = {
  title: 'SDU Student House',
  subtitle: 'is built for 1280 people in 4 blocks',
  description: 'SDU Student House is located on the territory of the Smart Campus in the immediate vicinity of the university building (30 meters). For students and guests of the university Next to Student House is a football field, volleyball and basketball courts. 24-hour security protects the campus ensuring the safety of all students and visitors. Moreover, for VIP guests in block “A” there are two VIP rooms with amenities.',
};

export const Hero = () => {
  return (
    // We make the section take up the full screen height and center its content vertically
    <section id="welcome" className="min-h-screen flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 'items-center' will vertically align both columns in the middle */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Image */}
          <div>
            <img src="/sduDor.png" alt="SDU Dorm Logo" />
          </div>

          {/* Right Column: Text */}
          <div className="text-[#2C3E50] relative top-30 max-w-xl">
            {/* We remove the top margin from the title */}
            <h2 className="text-5xl font-bold font-serif">{slide.title}</h2>
            <p className="text-[#ED9A71] text-lg mt-1 font-mono">{slide.subtitle}</p>
            <p className="mt-4 text-lg leading-relaxed font-mono">
              {slide.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};