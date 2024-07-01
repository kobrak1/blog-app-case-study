const Header = () => {
  return (
    <header className="">
      <div className="container mx-auto flex justify-around items-center">
        {/* Logo or Brand */}
        <a href="/" className="text-whit font-semibold">
          <img src="../public/main-logo.png" alt="#" className='w-24' />
        </a>

        {/* Navigation Links */}
        <nav className="space-x-4">
          <a href="/" className="text-gray-500 hover:text-gray-300">Home</a>
          <a href="/blogs" className="text-gray-500 hover:text-gray-300">Blogs</a>
          <a href="/about" className="text-gray-500 text-lg hover:text-gray-300">Post</a>
          <a href="/about" className="text-gray-500 hover:text-gray-300">About</a>
          <a href="/contact" className="text-gray-500 hover:text-gray-300">Contact</a>
        </nav>

        {/* Search bar and dark mode button */}
        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center rounded-md px-3 bg-slate-100">
            <input 
              type="text"
              placeholder="Search..."
              className="rounded-md bg-transparent focus:outline-none focus:border-transparent text-slate-500 pr-2 py-1 w-44"
            />
            <div className="">
              <img src="../../public/search-icon.svg" alt="#" />
            </div>
          </div>
        </div>

      </div>
    </header>
  )
}

export default Header
