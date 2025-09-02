import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to the character route
  redirect("/character");
}
