import TopBar from "../../components/topbar";
import ProjectLink from "./projectlink";

export default function Home() {
  const projectNames = ["IMS"];

  return (
    <div className="bg-blue-400 min-h-screen max-h-screen overflow-y-auto bg-gradient-to-br from-gray-100 to-orange-200 bg-cover">
      <TopBar />
      <div className="border border-white m-4 rounded-xl shadow-2xl bg-white">
        <h2 className="text-3xl font-semibold text-slate-900 font-serif m-4">
          Projects
        </h2>
        <div className="border border-stone-600 grid m-4 min-h-[400px] rounded-lg sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {projectNames.map((projectname, index) => (
            <ProjectLink key={index} projectName={projectname} />
          ))}
          {/* <div className=" max-h-[200] border border-stone-600 shadow-xl select-none m-5 text-center flex justify-center items-center text-white bg-black text-xl font-semibold cursor-pointer hover:bg-gray-400 hover:text-red-500 hover:scale-105 hover:shadow-2xl transition duration-300 p-4 rounded-lg">
            + Add New Project
          </div> */}
        </div>
      </div>
    </div>
  );
}
