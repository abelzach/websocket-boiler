import Chat from "./chat";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2" style={{ position: "static", bottom: "22px" }}>
      <Chat />
    </div>
  );
}
