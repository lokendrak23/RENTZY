const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        {/* Brand */}
        <div className="text-lg font-semibold mb-4 sm:mb-0">
          Rentzy © {new Date().getFullYear()}
        </div>

        {/* Links */}
        <div className="flex space-x-6 text-sm">
          <a href="/" className="hover:underline">Home</a>
          <a href="/login-signup" className="hover:underline">Login / Signup</a>
          <a href="#" className="hover:underline">Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
