import Link from "next/link";
import Image from "next/image";
import { AnimatedVideoPlaceholder } from "@/components/ui/animated-video-placeholder";

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-white w-full">
      <main className="flex-1 relative z-10 w-full">
        {/* Hero Section with Container */}
        <section className="relative pt-[0.9vh] pb-[0.5vh] sm:pt-[0.9vh] sm:pb-[0.5vh] lg:pt-[0.9vh] lg:pb-[0.5vh] overflow-visible bg-white flex items-start w-full hero-glow-bottom">
          <div className="w-full mx-auto px-1 sm:px-1 lg:px-1">
            {/* Hero Container with Curved Sides and Gradient - Almost Full Page */}
            <div className="w-[99.6%] mx-auto bg-gradient-hero rounded-[2rem] p-10 sm:p-12 lg:p-14 xl:p-16 h-[98.2vh] flex flex-col justify-center relative z-10 noise-overlay overflow-hidden">
              {/* Fuzzy circular gradient at bottom center - contained within container */}
              <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 w-[1200px] h-[500px] bg-radial-gradient-purple pointer-events-none z-0"></div>

              {/* Additional fuzzy overlay for bottom quarter - contained within container */}
              <div className="absolute bottom-0 left-0 right-0 h-[25%] pointer-events-none z-0" style={{
                background: 'radial-gradient(ellipse 120% 80% at center bottom, rgba(196, 181, 253, 0.7) 0%, rgba(167, 139, 250, 0.6) 20%, rgba(139, 92, 246, 0.5) 40%, rgba(109, 40, 217, 0.4) 60%, rgba(91, 33, 182, 0.3) 80%, transparent 100%)',
                filter: 'blur(120px)',
                WebkitFilter: 'blur(120px)'
              }}></div>

              {/* Embedded Navigation */}
              <div className="absolute top-4 left-4 right-4 sm:top-10 sm:left-10 sm:right-10 flex flex-row justify-between items-center z-20" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
                <Link href="/" className="flex items-center gap-2 sm:gap-3 text-sm sm:text-lg font-medium text-white hover:opacity-80 transition-opacity">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded overflow-hidden" style={{
                    border: '2px solid rgba(255, 255, 255, 0.4)'
                  }}>
                    <Image
                      src="/logo1.png"
                      alt="Motion Logo"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                      style={{ 
                        objectPosition: 'center',
                        transform: 'scale(1.6)'
                      }}
                    />
                  </div>
                  <span>Motion</span>
                </Link>
                <nav className="flex items-center gap-4 sm:gap-6">
                  {/* Labs Dropdown */}
                  <div className="hidden sm:block relative group">
                    <button className="text-white text-sm font-medium hover:bg-white/10 px-3 py-1.5 rounded-md transition-all">
                      Labs
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-40 backdrop-blur-md rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-white/30">
                      <Link
                        href="/lab"
                        className="block px-4 py-2.5 text-sm text-white hover:bg-white/20 transition-colors first:rounded-t-lg"
                      >
                        About
                      </Link>
                      <Link
                        href="/lab/upload"
                        className="block px-4 py-2.5 text-sm text-white hover:bg-white/20 transition-colors last:rounded-b-lg"
                      >
                        Try Labs
                      </Link>
                    </div>
                  </div>

                  {/* Work Dropdown */}
                  <div className="hidden sm:block relative group">
                    <button className="text-white text-sm font-medium hover:bg-white/10 px-3 py-1.5 rounded-md transition-all">
                      Work
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-40 backdrop-blur-md rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-white/30">
                      <Link
                        href="/work"
                        className="block px-4 py-2.5 text-sm text-white hover:bg-white/20 transition-colors first:rounded-t-lg"
                      >
                        About
                      </Link>
                      <Link
                        href="/work/queue"
                        className="block px-4 py-2.5 text-sm text-white hover:bg-white/20 transition-colors last:rounded-b-lg"
                      >
                        Work Now
                      </Link>
                    </div>
                  </div>

                  <Link
                    href="/waitlist"
                    className="px-4 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition-all text-sm font-medium"
                  >
                    Join Waitlist
                  </Link>
                </nav>
              </div>

              {/* Hero Content */}
              <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 px-4 pt-32 sm:pt-40" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium mb-4 leading-tight px-4">
                  <span className="text-white drop-shadow-2xl">Fix robot failures in short browser tasks.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base lg:text-lg text-white/70 mb-3 sm:mb-4 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-xl px-4">
                  Watch a failure clip, show the correct action. Your fix becomes training data.
                </p>

                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8">
                  <Link
                    href="/work/queue"
                    className="inline-block px-5 sm:px-6 py-1.5 sm:py-2 bg-white text-black text-sm sm:text-base font-medium rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto text-center"
                  >
                    View Work Queue
                  </Link>
                </div>

                {/* Demo Video Placeholder */}
                <AnimatedVideoPlaceholder />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="relative pt-16 sm:pt-24 md:pt-32 lg:pt-40 pb-12 sm:pb-16 overflow-visible bg-white">
          <div className="max-w-[1396px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-left mb-12 sm:mb-16">
              {/* Label - not purple */}
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3" style={{ fontFamily: "'Archivo', sans-serif" }}>
                HOW IT WORKS
              </p>
              
              {/* Main Headline with purple gradient */}
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
                <span className="text-slate-900">Do tasks, get paid. </span>
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(59, 7, 100, 1) 0%, rgba(76, 29, 149, 1) 40%, rgba(109, 40, 217, 1) 70%, rgba(167, 139, 250, 1) 100%)' }}>It's that simple.</span>
              </h2>
              
              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed whitespace-nowrap" style={{ fontFamily: "'Rethink Sans', sans-serif", letterSpacing: '-0.02em' }}>
                From fixing robot failures to correcting trajectories, earn money completing simple tasks.
              </p>
            </div>

            {/* Three Steps with Images */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 lg:gap-12 mb-12">
              {/* Step 1: Learn Easily */}
              <div className="flex-1 w-full md:w-auto">
                <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  {/* Image */}
                  <div className="w-full h-48 bg-slate-100 relative overflow-hidden">
                    <Image
                      src="/how.png"
                      alt="Learn Easily"
                      fill
                      className="object-cover"
                      style={{ transform: 'scale(1)' }}
                    />
                  </div>
                  <div className="p-6 bg-white border-t border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>
                      Learn Easily
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                      Quick tutorials and hands-on training to get started.
                    </p>
                  </div>
                </div>
              </div>

              {/* Arrow 1 - Centered */}
              <div className="hidden md:flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Step 2: Complete Tasks */}
              <div className="flex-1 w-full md:w-auto">
                <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  {/* Image */}
                  <div className="w-full h-48 bg-slate-200 relative overflow-hidden">
                    <Image
                      src="/fail.png"
                      alt="Complete Tasks"
                      fill
                      className="object-cover"
                      style={{ transform: 'scale(1.03)' }}
                    />
                  </div>
                  <div className="p-6 bg-white border-t border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>
                      Complete Tasks
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                      Fix robot failures and submit corrections from unlocked projects.
                    </p>
                  </div>
                </div>
              </div>

              {/* Arrow 2 - Centered */}
              <div className="hidden md:flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Step 3: Get Paid Weekly */}
              <div className="flex-1 w-full md:w-auto">
                <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  {/* Image */}
                  <div className="w-full h-48 bg-white relative overflow-hidden">
                    <Image
                      src="/e.png"
                      alt="Get Paid Weekly"
                      fill
                      className="object-cover"
                      style={{ transform: 'scale(1.1)', transformOrigin: 'center top', objectPosition: 'center -10px' }}
                    />
                  </div>
                  <div className="p-6 bg-white border-t border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>
                      Get Paid Weekly
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                      Fast payments via PayPal or bank transfer based on quality and volume.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-left">
              <Link
                href="/work/queue"
                className="inline-block px-8 py-4 bg-slate-900 text-white text-lg font-medium rounded-full hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                style={{ fontFamily: "'Archivo', sans-serif" }}
              >
                Start earning today
              </Link>
            </div>
          </div>
        </section>

        {/* Unlock Your Potential Section */}
        <section className="relative pt-20 sm:pt-28 md:pt-36 lg:pt-48 pb-24 sm:pb-32 lg:pb-40 overflow-visible bg-white">
          <div className="max-w-[1396px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-left mb-20 sm:mb-24">
              {/* Label - not purple */}
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3" style={{ fontFamily: "'Archivo', sans-serif" }}>
                UNLOCK YOUR POTENTIAL
              </p>
              
              {/* Main Headline with purple gradient */}
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
                <span className="text-slate-900">Level up, </span>
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(59, 7, 100, 1) 0%, rgba(76, 29, 149, 1) 40%, rgba(109, 40, 217, 1) 70%, rgba(167, 139, 250, 1) 100%)' }}>earn more.</span>
              </h2>
              
              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed" style={{ fontFamily: "'Rethink Sans', sans-serif", letterSpacing: '-0.02em' }}>
                Get trained on more difficult tasks that pay more.
              </p>
            </div>

            {/* Task Cards with Difficulty and Pay */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* Low Difficulty/Pay Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Image */}
                <div className="w-full h-64 bg-slate-100 relative overflow-hidden">
                  <Image
                    src="/easy.png"
                    alt="Easy Tasks"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-2">Difficulty</p>
                    <div className="flex gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      <div className="w-4 h-4 rounded-full bg-slate-200"></div>
                      <div className="w-4 h-4 rounded-full bg-slate-200"></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-2">Pay</p>
                    <div className="flex gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">$</span>
                      </div>
                      <div className="w-4 h-4 rounded-full bg-slate-200"></div>
                      <div className="w-4 h-4 rounded-full bg-slate-200"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medium Difficulty/Pay Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Image */}
                <div className="w-full h-64 bg-slate-200 relative overflow-hidden">
                  <Image
                    src="/mid.png"
                    alt="Medium Tasks"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-2">Difficulty</p>
                    <div className="flex gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                      <div className="w-4 h-4 rounded-full bg-slate-200"></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-2">Pay</p>
                    <div className="flex gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">$</span>
                      </div>
                      <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">$</span>
                      </div>
                      <div className="w-4 h-4 rounded-full bg-slate-200"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* High Difficulty/Pay Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Image */}
                <div className="w-full h-64 bg-slate-300 relative overflow-hidden">
                  <Image
                    src="/hard.png"
                    alt="Hard Tasks"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-2">Difficulty</p>
                    <div className="flex gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                      <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-2">Pay</p>
                    <div className="flex gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">$</span>
                      </div>
                      <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">$</span>
                      </div>
                      <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">$</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

         {/* Flexible Schedule Section */}
         <section className="relative pt-8 sm:pt-12 pb-20 sm:pb-28 lg:pb-32 overflow-visible bg-white">
          <div className="max-w-[1396px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div>
                {/* Label - not purple */}
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3" style={{ fontFamily: "'Archivo', sans-serif" }}>
                FLEXIBLE SCHEDULE
              </p>
              
              {/* Main Headline with purple gradient */}
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
                <span className="text-slate-900">Work from anywhere, </span>
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(59, 7, 100, 1) 0%, rgba(76, 29, 149, 1) 40%, rgba(109, 40, 217, 1) 70%, rgba(167, 139, 250, 1) 100%)' }}>anytime.</span>
              </h2>
              
              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed" style={{ fontFamily: "'Rethink Sans', sans-serif", letterSpacing: '-0.02em' }}>
                Enjoy the safety & flexibility of working remotely. All you need is a computer & internet.
              </p>
              </div>

               {/* Image */}
               <div className="w-full h-96 bg-slate-100 rounded-xl relative overflow-hidden">
                 <Image
                   src="/home.png"
                   alt="Work from anywhere"
                   fill
                   className="object-cover"
                 />
               </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

