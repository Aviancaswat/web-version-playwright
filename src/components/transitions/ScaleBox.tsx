import { chakra, type HTMLChakraProps } from "@chakra-ui/react"
import { motion, type MotionProps } from "framer-motion"

const MotionBox = motion(chakra.div)

type ScaleBoxProps = HTMLChakraProps<"div"> & MotionProps & {
    children?: React.ReactNode
}

export default function ScaleAnimationBox({ children, ...rest }: ScaleBoxProps) {
    return (
        <MotionBox
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.8,
                delay: 0.5,
                ease: [0, 0.71, 0.2, 1.01],
            }}
            {...rest}
        >
            {children}
        </MotionBox>
    )
}
