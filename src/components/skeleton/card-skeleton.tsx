import { Box, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

const CardSkeleton = () => {
    return (
        <Box
            height={150}
            width={200}
        >
            <SkeletonCircle size='10' float={"inline-end"}/>
            <SkeletonText mt='4' noOfLines={3} spacing='3' skeletonHeight='2' />
        </Box>
    )
}

export default CardSkeleton;