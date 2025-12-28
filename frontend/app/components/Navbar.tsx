import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-surface/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-heading font-bold text-text-primary">
              Universal Motion Model
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors">
              Home
            </Link>
            <Link href="/how" className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors">
              How
            </Link>
            <Link href="/work/queue" className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors">
              Work
            </Link>
            <Link href="/lab" className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors">
              Labs
            </Link>
            <Link href="/waitlist" className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors">
              Waitlist
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

