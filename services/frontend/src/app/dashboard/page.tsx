import TopBar from "../../components/topbar";
import Details from "../../components/details";
import NavLink from "../../components/navlink";
export default function Home() {
  return (
    <>
      <TopBar />
      <Details />
      <div className="border border-white flex flex-col sm:grid sm:grid-cols-2 m-4 rounded">
        <div className="text-2xl m-4 col-span-2">DashBoard</div>
        <div className="border border-white m-4 rounded">
          <NavLink href="/products/view" text="View Products" />
          <NavLink href="/products" text="Add Products" />
          <NavLink href="/products/sell" text="Sell Products" />
          <NavLink href="/analysis" text="Analysis" />
          <NavLink
            href="/refill-recommendations"
            text="Refill Recommendations"
          />
          <NavLink href="/history" text="History" />
        </div>
        <div className="border border-white m-4 rounded select-none">
          <h3 className="m-2"> Announcements</h3>
          <div className="border border-white m-4"></div>
        </div>
      </div>
    </>
  );
}
