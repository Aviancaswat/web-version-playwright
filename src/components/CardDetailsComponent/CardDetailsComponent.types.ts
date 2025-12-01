import type { LucideIconType } from "../TableTagItemComponent/TableTagItemComponent.types";

export type CardDetailsDashProps = {
  icon: LucideIconType,
  iconType: LucideIconType,
  title: string;
  value: string | number;
  type: "success" | "error" | "cancelled";
  stat: number | string;
};
