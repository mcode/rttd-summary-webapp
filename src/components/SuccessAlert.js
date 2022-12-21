import { CheckCircle } from "react-feather";

export default function SuccessAlert({ children }) {
  return (
    <div className="p-4 bg-emerald-600 text-white rounded-2xl w-auto flex space-x-2 items-center">
      <CheckCircle className="inline mr-2" size={24} />
      {children}
    </div>
  );
}
