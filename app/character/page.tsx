import { redirect } from "next/navigation";

export default function CharacterPage() {
  // Redirect to the combat tab by default
  redirect("/character/combat");
}
