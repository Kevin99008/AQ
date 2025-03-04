export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
          </p>
          <nav className="mt-4 md:mt-0">
            <ul className="flex flex-col md:flex-row gap-4 text-sm">
              <li>Tel. 0972762626</li>
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=100063802697610"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition"
                >
                  AquaKids
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=100067089941474"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition"
                >
                  PlaySound
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    );
  }
  