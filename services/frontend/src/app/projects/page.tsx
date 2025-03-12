import TopBar from "../../pages/components/topbar";
export default function Home() {
  const projectNames = ["project-1", "project-2", "project-3", "project-4"];
  return (
    <>
      <TopBar />
      <div className="border border-white m-4 rounded">
        <h2 className="text-2xl m-4">Projects</h2>
        <div className="border border-white   grid m-4 min-h-[400] rounded sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {projectNames.map((projectName, index) => (
            <div
              key={index}
              className="border border-white select-none m-4 text-center flex justify-center items-center text-xl"
            >
              {projectName}
            </div>
          ))}
          <div className="border border-white select-none m-4 text-center flex justify-center items-center text-xl">
            + new Project
          </div>
        </div>
      </div>
    </>
  );
}
