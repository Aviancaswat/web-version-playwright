import type { LucideProps } from "lucide-react";

export type ChildrenSideBarDashboardProps = {
  name: string;
  path: string;
  icon:
    | React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
      >
    | undefined;
};

export type SideBarDashboardProps = {
  childrens: ChildrenSideBarDashboardProps[];
};
