import Link from 'next/link';

export default function Header() {
  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-xl font-bold text-blue-600">GymRoster</div>
          <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
            <li>
              <Link className="nav-link" href="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="nav-link" href="/">
                Rosters
              </Link>
            </li>
            <li>
              <Link className="nav-link" href="/athletes">
                Athletes
              </Link>
            </li>
            <li>
              <Link className="nav-link" href="/">
                Coaches
              </Link>
            </li>
            <li>
              <Link className="nav-link" href="/">
                Colleges
              </Link>
            </li>
          </ul>
          <div className="md:hidden">
            <button className="text-blue-600 focus:outline-none">
              {/* You can insert a mobile hamburger icon here */}☰
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
