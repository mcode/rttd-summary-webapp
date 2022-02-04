import logo from "../codex-logo.png";
function Header() {
  return (
    <div className="bg-slate-600 w-screen">
      <header className="container sm:mx-auto px-4 sm:px-0 h-24 flex justify-between items-center text-lg">
        <p className="text-white text-lg md:text-2xl ">
          Radiation Therapy Treatment Data Summary
        </p>
        <img className="w-64 h-16" src={logo} alt="logo" />
      </header>
    </div>
  );
}

export default Header;
