import type { LucideProps } from "lucide-react";

export type CardDetailsDashProps = {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  title: string;
  value: string | number;
  type: "success" | "error" | "cancelled";
  stat: number | string;
};
