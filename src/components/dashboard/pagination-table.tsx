import { Button, ButtonGroup } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationTableDash = () => {
    return (
        <ButtonGroup
            width={"100%"}
            mt={2}
            display={"flex"}
            alignItems={"center"}
        >
            <Button
                size={"xs"}
                colorScheme="green"
            >
                <ChevronLeft size={15}/>
            </Button>
            {
                [1, 2, 3, 4, 5, 6, 7, 8, 9].map((btn, index) => (
                    <Button key={index} size={"xs"} colorScheme="green" variant={"outline"}>{btn}</Button>
                ))
            }
            <Button
                size={"xs"}
                colorScheme="green"
            >
                <ChevronRight size={15}/>
            </Button>
        </ButtonGroup>
    )
}

export default PaginationTableDash;