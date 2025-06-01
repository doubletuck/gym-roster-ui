import Link from 'next/link';

export default function Header() {
  return (
    <>
      <nav className="navbar navbar-expand-sm bg-primary-subtle">
        <div className="container-fluid">
          <div className="container-fluid navbar-nav">
            <Link className="nav-link" href="/">
              Home
            </Link>
            <Link className="nav-link" href="#">
              Rosters
            </Link>
            <Link className="nav-link" href="/athletes">
              Athletes
            </Link>
            <Link className="nav-link" href="#">
              Coaches
            </Link>
            <Link className="nav-link" href="#">
              Colleges
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
