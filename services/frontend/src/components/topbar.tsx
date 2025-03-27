const TopBar = () => {
  return (
    <div className="flex justify-between border border-l-white bg-gradient-to-r from-pink-200 via-white to-purple-300 m-4 min-w-max rounded-md">
      <a href="./dashboard" className="m-4 text-2xl font-bold text-neutral-950">
        IMS
      </a>
      <div className="m-4 text-neutral-950">Profile</div>
    </div>

  );
};
export default TopBar;
