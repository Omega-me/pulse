import SidebarContent from './sidebar-content';

const Sidebar = () => {
  return (
    <div
      className="w-[250px] border-2 radial fixed left-0 lg:inline-block border-[#545454] bg-gradient-to-b from-[#768BDD] via-[#171717] to-[#768BDD] hidden bottom-0 top-0 m-3 rounded-3xl 
      "
    >
      <SidebarContent />
    </div>
  );
};

export default Sidebar;
