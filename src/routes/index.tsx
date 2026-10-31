import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: BlankPage,
});

function BlankPage() {
  return <main style={{ minHeight: "100vh", width: "100%", background: "#ffffff" }} />;
}
