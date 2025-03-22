const TopBar = () => {
  return (
    <div className="flex justify-between border border-l-white bg-transparent m-4 min-w-max rounded-md">
      <a href="./dashboard" className="m-4 text-2xl font-bold text-neutral-950">
        IMS/Inventosaurus
      </a>
      <div className="m-4 text-neutral-950">Profile</div>
    </div>

  );
};
export default TopBar;
