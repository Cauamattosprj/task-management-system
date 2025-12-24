import { createFileRoute, redirect } from "@tanstack/react-router";
import logo from "../logo.svg";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context.auth;
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: App,
});

function App() {
  return <div>Teste</div>;
}
