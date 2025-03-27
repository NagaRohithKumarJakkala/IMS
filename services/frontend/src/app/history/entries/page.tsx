import EntryHistoryForm from "../../../components/entryhistory";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen min-w-full bg-[url('/dino-green.png')] bg-cover">
      <EntryHistoryForm branchId="1111" />
    </div>
  );
}
