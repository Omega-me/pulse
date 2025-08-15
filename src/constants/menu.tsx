import {
  DuotoneActivity,
  DuotoneBolt,
  DuotoneCart,
  DuotoneHouse,
  DuotoneRocket,
} from "@/components/global/icons";
import { v4 as uuid } from "uuid";

interface FieldProps {
  label: string;
  id: string;
}

export interface SidebarProps extends FieldProps {
  icon: React.ReactNode;
}

export const SIDEBAR_MENU: SidebarProps[] = [
  {
    id: uuid(),
    label: "home",
    icon: (
      <DuotoneHouse
        accentOpacity={0.5}
        baseOpacity={1}
        baseColor="gray"
        accentColor="#16181E"
        borderOpacity={0.5}
      />
    ),
  },
  {
    id: uuid(),
    label: "automations",
    icon: (
      <DuotoneActivity
        accentOpacity={0}
        baseOpacity={1}
        baseColor="gray"
        accentColor="#16181E"
        borderOpacity={0.5}
      />
    ),
  },
  {
    id: uuid(),
    label: "integrations",
    icon: (
      <DuotoneRocket
        accentOpacity={0.5}
        baseOpacity={1}
        baseColor="gray"
        accentColor="#16181E"
        borderOpacity={1}
      />
    ),
  },
  {
    id: uuid(),
    label: "products",
    icon: (
      <DuotoneCart
        accentOpacity={0.5}
        baseOpacity={1}
        baseColor="gray"
        accentColor="#16181E"
        borderOpacity={0.5}
      />
    ),
  },
  {
    id: uuid(),
    label: "settings",
    icon: (
      <DuotoneBolt
        accentOpacity={0.5}
        baseOpacity={1}
        baseColor="gray"
        accentColor="#16181E"
        borderOpacity={0.5}
      />
    ),
  },
];
