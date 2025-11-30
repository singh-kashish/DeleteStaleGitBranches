import { auth } from "@/auth";
import LogoutButton from "../components/LogoutButton";

export default async function Dashboard() {
  const session = await auth();

  if (!session) return <div>Not authenticated</div>;

  return (
    <div className="p-8">
      <h1>Welcome {session.user?.name}</h1>
      <p>GitHub Token stored securely (server-only)</p>
      <LogoutButton />
    </div>
  );
}
