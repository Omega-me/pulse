import GlowCard from "../glow-card";
import SidebarContent from "./sidebar-content";

const Sidebar = () => {
  return (
    <GlowCard
      spread={50}
      glow
      proximity={64}
      inactiveZone={0.01}
      borderWidth={2}
      containerClassName="bg-[#1d1d1d] rounded-md w-[99%] mx-auto h-auto w-[250px] border-2 radial fixed left-0 lg:inline-block border-[#545454] bg-gradient-to-b from-[#768BDD] via-[#171717] to-[#768BDD] hidden bottom-0 top-0 m-3 rounded-md"
    >
      <SidebarContent />
    </GlowCard>
  );
};

export default Sidebar;
