import type { LucideProps } from "lucide-react";
import type { ResultWorkflow, StatusWorkflow } from "../../github/repository/github.repository";

export type TagDashProps = {
  type: StatusWorkflow | ResultWorkflow;
};

export type LucideIconType = React.ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
>;
