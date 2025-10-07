import { Box, Button, HStack, Tooltip } from "@chakra-ui/react";
import { SearchX, Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTestStore } from "../../store/test-store";
import FilterComponent, { type FilterProps } from "./FilterComponent";

const FiltersComponentAll: React.FC = () => {

    const { dataWorkflows } = useTestStore()
    const [actors, setActors] = useState<string[]>([])
    const [workflows, setWorkflows] = useState<string[]>([])
    const [status, setStatus] = useState<string[]>([])
    const [results, setResults] = useState<string[]>([])
    const [dataFilters, setDataFilters] = useState<FilterProps[]>([])

    useEffect(() => {
        if (dataWorkflows.length === 0) return;
        const dataActors = new Set(dataWorkflows.map(e => e.actor?.autorname))
        const dataNamesWorkflows = new Set(dataWorkflows.map(e => e.display_title))
        const dataStatus = new Set(dataWorkflows.map(e => e.status !== null ? e.status : ""))
        const dataResults = new Set(dataWorkflows.map(e => e.conclusion !== null ? e.conclusion : ""))
        setActors([...dataActors])
        setWorkflows([...dataNamesWorkflows])
        setStatus([...dataStatus])
        setResults([...dataResults])

        const dataFilterCompleted: FilterProps[] = [
            {
                title: "Autores",
                data: actors,
                type: 'autor'
            },
            {
                title: "Nombre del workflow",
                data: workflows,
                type: 'workflow'
            },
            {
                title: "Status",
                data: status,
                type: 'status'
            },
            {
                title: "Resultado",
                data: results,
                type: 'result'
            }
        ]
        console.log("dataFilterCompleted: ", dataFilterCompleted)
        setDataFilters(dataFilterCompleted)
    }, [dataWorkflows])

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
                    bg={"black"}
                    color={"white"}
                    size={"xs"}
                    rightIcon={<Settings2 size={20} />}
                    _hover={{
                        bg: "gray.700"
                    }}
                >
                    Aplicar
                </Button>
                <Tooltip label="Borrar filtros" bg={"white"} color={"black"} placement="top" borderRadius={"md"}>
                    <Button
                        bg={"black"}
                        color={"white"}
                        size={"xs"}
                        _hover={{
                            bg: "gray.700"
                        }}
                    >
                        <SearchX size={20} />
                    </Button>
                </Tooltip>
            </HStack>
        </Box>
    )
}

export default FiltersComponentAll;