import TopBar from "../../pages/components/topbar";
export default function Home() {
  return (
    <>
      <TopBar />
      <div className="border border-white flex flex-col sm:grid sm:grid-cols-2 m-4 rounded">
        <div className="text-2xl m-4 col-span-2">DashBoard</div>
        <div className="border border-white m-4 rounded">
          <div className="border border-white m-4 p-2 rounded select-none">
            view products
          </div>
          <div className="border border-white m-4 p-2 rounded select-none">
            add products
          </div>
          <div className="border border-white m-4 p-2 rounded select-none">
            sell products
          </div>
          <div className="border border-white m-4 p-2 rounded select-none">
            analysis
          </div>
          <div className="border border-white m-4 p-2 rounded select-none">
            refill recommandations
          </div>
          <div className="border border-white m-4 p-2 rounded select-none">
            History
          </div>
        </div>
        <div className="border border-white m-4 rounded select-none">
          <h3 className="m-2"> Announcements</h3>
          <div className="border border-white m-4"></div>
        </div>
      </div>
    </>
  );
}
