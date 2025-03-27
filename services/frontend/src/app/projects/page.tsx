import TopBar from "../../components/topbar";
import ProjectLink from "./projectlink";

export default function Home() {
  const projectNames = ["Project-1"];

  return (
    <div className="bg-blue-400 min-h-screen max-h-screen overflow-y-auto bg-[url('/blue.png')] bg-cover">
      <TopBar />
      <div className="border border-white m-4 rounded-xl shadow-xl bg-white">
        <h2 className="text-3xl font-semibold text-slate-900 font-serif m-4">
          Projects
        </h2>
        <div className="border border-stone-600 grid m-4 min-h-[400px] rounded-lg sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {projectNames.map((projectname, index) => (
            <ProjectLink key={index} projectName={projectname} />
          ))}
          <div className=" max-h-[200] border border-stone-600 shadow-xl select-none m-4 text-center flex justify-center items-center text-white bg-black text-xl font-semibold cursor-pointer hover:bg-gray-400 hover:text-red-500 transition duration-300 p-4 rounded-lg">
            + Add New Project
          </div>
        </div>
      </div>
    </div>
  );
}
