import TopBar from "../../components/topbar";
import Details from "../../components/details";
import NavLink from "../../components/navlink";
export default function Home() {
  return (
    <>
      <TopBar />
      <Details />
      <div className="border border-white flex flex-col m-4 rounded">
        <div className="text-2xl m-4 col-span-2">Add product</div>
        <div className="border border-white m-4 rounded">
          <NavLink href="/products/add" text="Add to stock" />
          <NavLink href="/products/create" text="register new Product" />
        </div>
      </div>
    </>
  );
}
