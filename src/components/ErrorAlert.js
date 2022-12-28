import Alert from "./Alert";

export default function ErrorAlert({ children }) {
  return <Alert type={"error"}>{children}</Alert>;
}
