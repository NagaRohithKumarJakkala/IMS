import TopBar from "../../pages/components/topbar";
export default function Home() {
  const branchNames = ["branch-1", "branch-2", "branch-3", "branch-4"];
  return (
    <>
      <TopBar />
      <div className="border border-white m-4 rounded">
        <h2 className="text-2xl m-4">Branches</h2>
        <div className="border border-white   grid m-4 min-h-[400] rounded sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {branchNames.map((branchName, index) => (
            <div
              key={index}
              className="border border-white select-none m-4 text-center flex justify-center items-center text-xl"
            >
              {branchName}
            </div>
          ))}
          <div className="border border-white select-none m-4 text-center flex justify-center items-center text-xl">
            All branches
          </div>
          <div className="border border-white select-none m-4 text-center flex justify-center items-center text-xl">
            + new branch
          </div>
        </div>
      </div>
    </>
  );
}
