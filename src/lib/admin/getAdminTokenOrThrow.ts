import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/authOptions";

export default async function getAdminTokenOrThrow() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  if (!token) {
    throw new Error("Unauthorized");
  }

  return token;
}
