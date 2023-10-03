import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/auth-options";
import SignoutButton from "./signoutButton";

export default async function Home() {
  const getSession = await getServerSession(authOptions);
  if (!getSession) {
    redirect("/authwall/sign-in");
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello Next auth</h1> <p>{JSON.stringify(getSession)}</p>{" "}
      <SignoutButton />
    </main>
  );
}
