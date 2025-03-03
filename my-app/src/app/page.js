import { redirect } from "next/navigation";


export default function Page() {
// Check authentication state

    redirect("/login");

  return <div>Welcome to XDO!</div>;
}
