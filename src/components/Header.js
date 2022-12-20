import logo from "../assets/codex-logo.png";
function Header() {
  return (
    <div className="bg-slate-600 w-screen max-w-full">
      <header className="px-4 md:px-8 h-24 flex justify-start items-center text-lg">
        <p className="text-white text-2xl ">
          Radiation Therapy Treatment Data Summary
        </p>
        <img className="w-32 h-8 ml-4" src={logo} alt="logo" />
      </header>
    </div>
  );
}

export default Header;
