import { CheckCircle, XCircle } from "react-feather";

export default function Alert({ children, type }) {
  let bgType = "";
  let Logo = undefined;
  switch (type) {
    case "success":
      Logo = CheckCircle;
      bgType = "bg-emerald-600";
      break;
    case "error":
      Logo = XCircle;
      bgType = "bg-rose-600";
      break;
    default:
      console.warn("Trying to create an alert of unknown type: ", type);
  }

  return (
    <div
      className={`p-4 text-white rounded-2xl w-auto flex space-x-2 items-center ${bgType}`}
    >
      {Logo && <Logo className="inline mr-2" size={24} />}
      {children}
    </div>
  );
}
