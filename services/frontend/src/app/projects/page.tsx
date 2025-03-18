import TopBar from "../../components/topbar";
import ProjectLink from "./projectlink";

export default function Home() {
  const projectNames = ["project-1", "project-2", "project-3", "project-4"];

  return (
    <>
      <TopBar />
      <div className="border border-white m-4 rounded">
        <h2 className="text-2xl m-4">Projects</h2>
        <div className="border border-white grid m-4 min-h-[400px] rounded sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {projectNames.map((projectname, index) => (
            <ProjectLink key={index} projectName={projectname} />
          ))}
          <div className="border border-white select-none m-4 text-center flex justify-center items-center text-xl cursor-pointer hover:bg-gray-700 transition duration-300 p-4 rounded">
            + New Project
          </div>
        </div>
      </div>
    </>
  );
}
