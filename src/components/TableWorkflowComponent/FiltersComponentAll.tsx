import { Box, Button, HStack } from "@chakra-ui/react";
import { SearchX, Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getRunsByRepo } from "../../github/api";
import { useTestStore, type FilterGeneric } from "../../store/test-store";
import AnimatedLoader from "../loaders/AnimatedLoader";
import FilterComponent, { type FilterProps } from "./FilterComponent";
import type { DataWorkflows } from "./TableWorkflowComponent.types";

const FiltersComponentAll: React.FC = () => {

    const { setDataWorkflows, dataWorkflows, selectedFilters, setSelectedFilters } = useTestStore()
    const [dataFilters, setDataFilters] = useState<FilterProps[]>([])
    const [isLoading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (dataWorkflows.length === 0) return;
        const dataActors = new Set(dataWorkflows.map(e => e.actor?.autorname))
        const dataNamesWorkflows = new Set(dataWorkflows.map(e => e.display_title))
        const dataStatus = new Set(dataWorkflows.map(e => e.status !== null ? e.status : ""))
        const dataResults = new Set(dataWorkflows.map(e => e.conclusion !== null ? e.conclusion : ""))

        const dataFilterCompleted: FilterProps[] = [
            {
                title: "Autores",
                data: [...dataActors],
                type: 'autor'
            },
            {
                title: "Nombre del workflow",
                data: [...dataNamesWorkflows],
                type: 'workflow'
            },
            {
                title: "Status",
                data: [...dataStatus],
                type: 'status'
            },
            {
                title: "Resultado",
                data: [...dataResults],
                type: 'result'
            }
        ]

        setDataFilters(dataFilterCompleted)
    }, [dataWorkflows])

    const handleFilterTable = () => {
        const dataTable = dataWorkflows;
        const applyFilters = (filters: FilterGeneric[]) => {
            return dataTable.filter(item => {
                return filters.every(filter => {
                    let itemValue: any;
                    if (filter.type === "autor") {
                        itemValue = item.actor.autorname;
                    } else if (filter.type === "status") {
                        itemValue = item.status;
                    } else if (filter.type === "result") {
                        itemValue = item.conclusion;
                    } else if (filter.type === "workflow") {
                        itemValue = item.display_title;
                    }
                    return filter.values.includes(itemValue);
                });
            });
        };
        const dataFilter = applyFilters(selectedFilters)
        setDataWorkflows(dataFilter)
    }

    const clearFilter = () => {
        setSelectedFilters([])
        const getWorkflows = async () => {
            setLoading(true);
            try {
                const runs = await getRunsByRepo();
                if (runs.length === 0) throw new Error("No hay workflows");
                const newData: DataWorkflows[] = runs.map((workflow) => ({
                    id: workflow.id,
                    actor: {
                        autorname: workflow?.actor?.login,
                        avatar: workflow?.actor?.avatar_url,
                    },
                    display_title: workflow.display_title,
                    status: workflow.status,
                    conclusion: workflow.conclusion,
                    total_count: workflow.total_count,
                }));
                setDataWorkflows(newData);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getWorkflows()
    }

    return (
        <Box display={"flex"} gap={2}>
            <Box display={"flex"} gap={2}>
                {
                    dataFilters.map((data, idx) => (
                        <FilterComponent key={idx} {...data} />
                    ))
                }
            </Box>
            <HStack spacing={1}>
                <Button
                    isDisabled={isLoading}
                    bg={"black"}
                    color={"white"}
                    size={"xs"}
                    rightIcon={<Settings2 size={20} />}
                    _hover={{
                        bg: "gray.700"
                    }}
                    onClick={handleFilterTable}
                >
                    Aplicar
                </Button>
                <Button
                    variant={"ghost"}
                    size={"xs"}
                    _hover={{
                        bg: "black",
                        color: "white"
                    }}
                    onClick={clearFilter}
                    rightIcon={isLoading ?  <AnimatedLoader width={15} height={15}/> : <SearchX size={20} />}
                >
                    Limpiar
                </Button>
            </HStack>
        </Box>
    )
}

export default FiltersComponentAll;