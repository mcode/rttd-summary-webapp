import Alert from "./Alert";

export default function SuccessAlert({ children }) {
  return <Alert type={"success"}>{children}</Alert>;
}
