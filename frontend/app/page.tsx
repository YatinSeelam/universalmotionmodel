import Link from "next/link";
import Image from "next/image";
import { SparklesDemo } from "@/components/ui/sparkles-demo";
import {
  AnimatedCard,
  CardBody,
  CardDescription,
  CardTitle,
  CardVisual,
} from "@/components/ui/animated-card";
import { Visual1 } from "@/components/ui/animated-card";
import {
  AnimatedCardChart,
  CardBodyChart,
  CardDescriptionChart,
  CardTitleChart,
  CardVisualChart,
} from "@/components/ui/animated-card-chart";
import { Visual3 } from "@/components/ui/animated-card-chart";
import { AnimatedVideoPlaceholder } from "@/components/ui/animated-video-placeholder";

export default function Home() {
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
                  <span className="text-white drop-shadow-2xl">Crowdsourcing human data for robot learning.</span>
            </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base lg:text-lg text-white/70 mb-3 sm:mb-4 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-xl px-4">
                  When robots fail, humans fix it. We turn those fixes into training data.
                </p>

                {/* CTA Buttons - Below hero text */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8">
              <Link
                href="/work"
                    className="inline-block px-5 sm:px-6 py-1.5 sm:py-2 bg-white text-black text-sm sm:text-base font-medium rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto text-center"
              >
                    For Workers
              </Link>
              <Link
                href="/lab"
                    className="inline-block px-5 sm:px-6 py-1.5 sm:py-2 bg-transparent border-2 border-white text-white text-sm sm:text-base font-medium rounded-full hover:bg-white/10 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto text-center"
              >
                    For Labs
              </Link>
            </div>

                {/* Video Placeholder with 3D Scroll Animation */}
                <AnimatedVideoPlaceholder />
              </div>

              {/* Logos with Sparkles */}
              <div className="absolute bottom-0 left-0 right-0 z-[3] overflow-visible" style={{ paddingTop: '100px' }}>
                <SparklesDemo />
              </div>
          </div>
        </div>
      </section>

        {/* Mission Section - Right after Hero */}
        <section className="relative pt-16 sm:pt-24 md:pt-32 lg:pt-40 pb-4 sm:pb-6 overflow-visible bg-white">
          <div className="max-w-[1396px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-left">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight whitespace-nowrap" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
                <span className="text-slate-900 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">Data to train </span><span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(59, 7, 100, 1) 0%, rgba(76, 29, 149, 1) 40%, rgba(109, 40, 217, 1) 70%, rgba(167, 139, 250, 1) 100%)' }}>smarter machines</span>.
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed whitespace-nowrap" style={{ fontFamily: "'Rethink Sans', sans-serif", letterSpacing: '-0.02em' }}>
                Computers learned to talk, and now they're learning to move as we turn corrections into training data.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Training Section */}
        <section className="relative pt-8 sm:pt-10 lg:pt-12 pb-20 sm:pb-28 lg:pb-32 overflow-visible bg-white">
          <div className="max-w-[1396px] mx-auto px-6 sm:px-8 lg:px-12">
            {/* Large White Container with Outline */}
            <div className="bg-white rounded-2xl border border-slate-300 overflow-visible relative lg:min-h-[690px]">
              <div className="flex flex-col lg:flex-row relative h-full">
                {/* Left Column - White Content Block */}
                <div className="lg:w-[35%] p-6 sm:p-12 lg:p-16 flex flex-col justify-start pt-12 lg:pt-32 relative z-10" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
                    FOR WORKERS
                  </p>
                  <h2 className="text-5xl sm:text-6xl lg:text-7xl font-medium mb-8 leading-tight text-slate-900">
                    Manually fix robot failures
                  </h2>
                  <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed">
                    Watch a short failure clip, then show the correct action. Your fix becomes training data.
                  </p>
                  <Link
                    href="/work/queue"
                    className="inline-block w-fit px-8 py-4 bg-slate-900 text-white text-lg font-medium rounded-full hover:bg-slate-800 transition-all transform hover:-translate-y-0.5"
                  >
                    View Work Queue →
                  </Link>
                </div>

                {/* Right Column - White Background with Purple Gradient Placeholder */}
                <div className="h-[250px] lg:h-auto lg:w-[65%] lg:absolute lg:right-0 lg:top-0 lg:bottom-0 relative p-4 sm:p-8 lg:p-12">
                  {/* Purple Gradient Placeholder Image Area */}
                  <div className="w-full h-full relative bg-gradient-hero noise-overlay overflow-hidden rounded-2xl">
                    {/* Fuzzy circular gradient at bottom center */}
                    <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 w-[800px] h-[400px] bg-radial-gradient-purple pointer-events-none z-0"></div>

                    {/* Additional fuzzy overlay for bottom quarter */}
                    <div className="absolute bottom-0 left-0 right-0 h-[25%] pointer-events-none z-0" style={{
                      background: 'radial-gradient(ellipse 120% 80% at center bottom, rgba(196, 181, 253, 0.7) 0%, rgba(167, 139, 250, 0.6) 20%, rgba(139, 92, 246, 0.5) 40%, rgba(109, 40, 217, 0.4) 60%, rgba(91, 33, 182, 0.3) 80%, transparent 100%)',
                      filter: 'blur(120px)',
                      WebkitFilter: 'blur(120px)'
                    }}></div>

                    {/* Screen Mockup Image */}
                    {/* Crop values: top, right, bottom, left - adjust these percentages to crop the image */}
                    <div className="absolute inset-0 flex items-center justify-center z-10" style={{
                      paddingTop: '8%',    // Crop from top
                      paddingRight: '3%',   // Crop from right (less horizontal crop)
                      paddingBottom: '8%',  // Crop from bottom
                      paddingLeft: '3%'     // Crop from left (less horizontal crop)
                    }}>
                      <div className="w-full h-full relative shadow-2xl rounded-lg overflow-hidden">
                        <Image
                          src="/fix.png"
                          alt="Fix Robot Failures"
                          fill
                          className="object-contain"
                          style={{ 
                            objectPosition: 'center'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            </div>
          </div>

          <div className="max-w-[1396px] mx-auto px-6 sm:px-8 lg:px-12 mt-20">
            {/* Large White Container with Outline */}
            <div className="bg-white rounded-2xl border border-slate-300 overflow-visible relative lg:min-h-[690px]">
              <div className="flex flex-col-reverse lg:flex-row relative h-full">
                {/* Left Column - Purple Gradient Placeholder */}
                <div className="h-[250px] lg:h-auto lg:w-[65%] p-4 sm:p-8 lg:p-12 flex">
                  <div className="w-full h-full relative bg-gradient-hero noise-overlay overflow-hidden rounded-2xl">
                    <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 w-[800px] h-[400px] bg-radial-gradient-purple pointer-events-none z-0"></div>
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[25%] pointer-events-none z-0"
                      style={{
                        background:
                          'radial-gradient(ellipse 120% 80% at center bottom, rgba(196, 181, 253, 0.7) 0%, rgba(167, 139, 250, 0.6) 20%, rgba(139, 92, 246, 0.5) 40%, rgba(109, 40, 217, 0.4) 60%, rgba(91, 33, 182, 0.3) 80%, transparent 100%)',
                        filter: 'blur(120px)',
                        WebkitFilter: 'blur(120px)',
                      }}
                    ></div>
          </div>
        </div>

                {/* Right Column - White Content Block */}
                <div className="lg:w-[35%] p-6 sm:p-12 lg:p-16 flex flex-col justify-start pt-12 lg:pt-32 relative z-10" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
                    HOW IT WORKS
                  </p>
                  <h2 className="text-5xl sm:text-6xl lg:text-7xl font-medium mb-8 leading-tight text-slate-900">
                    Your fix becomes data
                  </h2>
                  <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed">
                    We save the corrected trajectory, label the failure point, and package it for training.
                  </p>
              <Link
                    href="/work/queue"
                    className="inline-block w-fit px-8 py-4 bg-slate-900 text-white text-lg font-medium rounded-full hover:bg-slate-800 transition-all transform hover:-translate-y-0.5"
              >
                    How it works →
              </Link>
                </div>
              </div>

              
            </div>
            </div>

          <div className="max-w-[1396px] mx-auto px-6 sm:px-8 lg:px-12 mt-20">
            {/* Large White Container with Outline */}
            <div className="bg-white rounded-2xl border border-slate-300 overflow-visible relative lg:min-h-[690px]">
              <div className="flex flex-col lg:flex-row relative h-full">
                {/* Left Column - White Content Block */}
                <div className="lg:w-[35%] p-6 sm:p-12 lg:p-16 flex flex-col justify-start pt-12 lg:pt-32 relative z-10" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
                    FOR LABS
                  </p>
                  <h2 className="text-5xl sm:text-6xl lg:text-7xl font-medium mb-8 leading-tight text-slate-900">
                    Upload runs, get fixes
                  </h2>
                  <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed">
                    Upload robot episodes. We detect failures and route them to workers for correction.
                  </p>
              <Link
                    href="/simulation"
                    className="inline-block w-fit px-8 py-4 bg-slate-900 text-white text-lg font-medium rounded-full hover:bg-slate-800 transition-all transform hover:-translate-y-0.5"
              >
                    Lab Dashboard →
              </Link>
            </div>

                {/* Right Column - White Background with Purple Gradient Placeholder */}
                <div className="h-[250px] lg:h-auto lg:w-[65%] lg:absolute lg:right-0 lg:top-0 lg:bottom-0 relative p-4 sm:p-8 lg:p-12">
                  {/* Purple Gradient Placeholder Image Area */}
                  <div className="w-full h-full relative bg-gradient-hero noise-overlay overflow-hidden rounded-2xl">
                    {/* Fuzzy circular gradient at bottom center */}
                    <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 w-[800px] h-[400px] bg-radial-gradient-purple pointer-events-none z-0"></div>

                    {/* Additional fuzzy overlay for bottom quarter */}
                    <div className="absolute bottom-0 left-0 right-0 h-[25%] pointer-events-none z-0" style={{
                      background: 'radial-gradient(ellipse 120% 80% at center bottom, rgba(196, 181, 253, 0.7) 0%, rgba(167, 139, 250, 0.6) 20%, rgba(139, 92, 246, 0.5) 40%, rgba(109, 40, 217, 0.4) 60%, rgba(91, 33, 182, 0.3) 80%, transparent 100%)',
                      filter: 'blur(120px)',
                      WebkitFilter: 'blur(120px)'
                    }}></div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>



        {/* Data Visualization Section - Hero Container Style */}
        <section className="relative pt-[0.9vh] pb-[0.5vh] sm:pt-[0.9vh] sm:pb-[0.5vh] lg:pt-[0.9vh] lg:pb-[0.5vh] overflow-visible bg-white flex items-start w-full">
          <div className="w-full mx-auto px-1 sm:px-1 lg:px-1">
            <div className="w-[99.6%] mx-auto bg-gradient-hero rounded-[2rem] p-4 sm:p-12 lg:p-14 xl:p-16 h-[98.2vh] flex flex-col justify-center relative z-10 noise-overlay overflow-hidden">
              {/* Fuzzy circular gradient at bottom center - contained within container */}
              <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 w-[1200px] h-[500px] bg-radial-gradient-purple pointer-events-none z-0"></div>

              {/* Additional fuzzy overlay for bottom quarter - contained within container */}
              <div className="absolute bottom-0 left-0 right-0 h-[25%] pointer-events-none z-0" style={{
                background: 'radial-gradient(ellipse 120% 80% at center bottom, rgba(196, 181, 253, 0.7) 0%, rgba(167, 139, 250, 0.6) 20%, rgba(139, 92, 246, 0.5) 40%, rgba(109, 40, 217, 0.4) 60%, rgba(91, 33, 182, 0.3) 80%, transparent 100%)',
                filter: 'blur(120px)',
                WebkitFilter: 'blur(120px)'
              }}></div>

              <div className="relative z-10 flex flex-col justify-center items-center h-full">
                <div className="text-center mb-6 sm:mb-12">
                  <p className="text-xs font-medium text-white/80 uppercase tracking-wider mb-4">
                    WHY IT WORKS
                  </p>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-6xl font-medium mb-6 leading-tight text-white drop-shadow-2xl" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
                    Fast, scalable data production
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-xl" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
                    Labs get clean fixes. Workers get simple tasks. Models get better data.
                  </p>
                </div>

                {/* Visualization Cards */}
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6 justify-center items-start scale-[0.85] sm:scale-100 origin-center">
                  <AnimatedCard>
                    <CardVisual>
                      <Visual1 mainColor="#8b5cf6" secondaryColor="#a78bfa" />
                    </CardVisual>
                    <CardBody>
                      <CardTitle>Failure Insights</CardTitle>
                      <CardDescription>
                        See where robots break and why
                      </CardDescription>
                    </CardBody>
                  </AnimatedCard>
                  <AnimatedCardChart>
                    <CardVisualChart>
                      <Visual3 mainColor="#8b5cf6" secondaryColor="#a78bfa" />
                    </CardVisualChart>
                    <CardBodyChart>
                      <CardTitleChart>Dataset Exports</CardTitleChart>
                      <CardDescriptionChart>
                        Download accepted runs + fixes
                      </CardDescriptionChart>
                    </CardBodyChart>
                  </AnimatedCardChart>
                </div>
              </div>
            </div>
        </div>
      </section>

        {/* Funding Section */}
        <section className="relative pt-16 sm:pt-32 md:pt-40 lg:pt-48 pb-12 sm:pb-16 md:pb-20 lg:pb-24 overflow-visible bg-white">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium mb-6 leading-tight text-slate-900">
              Robots learned perception.
            </h2>
            <p className="text-2xl sm:text-3xl lg:text-4xl text-slate-900 mb-6 leading-relaxed font-medium">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-purple-950 via-purple-800 to-purple-500">
                Now they learn control.
              </span>
            </p>
            <p className="text-lg sm:text-xl text-slate-600 mb-6">
              Motion is the human-in-the-loop layer for robot learning data.
            </p>
            <div className="flex justify-center items-center">
              <p className="text-base sm:text-lg text-slate-600">
                Built for labs shipping real robots.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
