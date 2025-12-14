export default function Footer() {
  return (
    <footer className="fixed-footer">
      <div className="w-[360px] mx-auto px-2">
        <div className="bg-gray-50 rounded-md px-3 py-2 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <div>
            © 2025
            <a
              className="text-gray-500 hover:text-gray-600 ml-1"
              href="https://genixo.ai/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Genixo
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a href="/about" className="hover:text-gray-600">
              About
            </a>
            <a href="/blog" className="hover:text-gray-600">
              Blog
            </a>
            <a href="/contact" className="hover:text-gray-600">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
