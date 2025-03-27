import EntryHistoryForm from "../../../components/entryhistory";

export default function Home() {
  return (
    <div className="flex justify-center min-h-screen min-w-full bg-gradient-to-br from-violet-500 to-black bg-cover">
      <EntryHistoryForm branchId="1111" />
    </div>
  );
}
