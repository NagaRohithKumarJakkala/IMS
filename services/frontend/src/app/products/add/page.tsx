import TopBar from "@/components/topbar";
import EntryForm from "../../../components/entryform";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen min-w-full bg-gradient-to-br from-gray-100 to-gray-300 bg-cover">
      <TopBar />
      <EntryForm />
    </div>
  );
}
