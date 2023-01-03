export default function BasicButton({
  children,
  onClick,
  disabled,
  className,
}) {
  return (
    <button
      className={`my-4 p-2 border border-gray-400 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-200 cursor-pointer disabled:cursor-not-allowed transition-all shadow-lg active:shadow ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
