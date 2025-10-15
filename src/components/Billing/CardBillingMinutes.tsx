import { Box, Card, Text } from "@chakra-ui/react";
import { Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { GetActionsMinutesBilling } from "../../github/api";

const CardBillingMinutes = () => {

    const [minutes, setMinutes] = useState<number>(0)
    const [storage, setStorage] = useState<number>(0)

    useEffect(() => {
        const currentMonth = '2025-10'
        const getActionsMinutes = async () => {
            const { usageItems: data } = await GetActionsMinutesBilling()
            console.log("response actions minutes: ", data)

            if (!data || data.length === 0) return;

            let totalMinutes = 0;
            let totalStorage = 0;

            data.forEach(item => {
                const itemDate = item.date.split('T')[0];
                const itemMonth = itemDate.substring(0, 7);
                if (item.product === "actions" && item.unitType === "Minutes" && itemMonth === currentMonth) {
                    totalMinutes += item.quantity;
                }
                if (item.sku === "Actions storage" && item.unitType === "GigabyteHours" && itemMonth === currentMonth) {
                    totalStorage += item.quantity;
                }
            })
            setMinutes(totalMinutes)
            setStorage(totalStorage)
        }

        getActionsMinutes()
    }, [])

    return (
        <Card>
            <Box className="logo">
                <Timer size={20} />
            </Box>
            <Box className="text">
                <Text>Lorem ipsum dolor sit amet consectetur adipisicing.</Text>
                <Text>Minutes: {minutes}</Text>
                <Text>Precing: {storage}</Text>
            </Box>
        </Card>
    )
}

export default CardBillingMinutes;