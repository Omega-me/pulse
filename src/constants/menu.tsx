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
    icon: <DuotoneHouse />,
  },
  {
    id: uuid(),
    label: "automations2",
    icon: <DuotoneActivity baseOpacity={1} accentOpacity={0} />,
  },
  {
    id: uuid(),
    label: "integrations",
    icon: <DuotoneRocket />,
  },
  {
    id: uuid(),
    label: "products",
    icon: <DuotoneCart />,
  },
  {
    id: uuid(),
    label: "settings",
    icon: <DuotoneBolt />,
  },
];
