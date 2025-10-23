import { chakra, type HTMLChakraProps } from "@chakra-ui/react"
import { motion, type MotionProps } from "framer-motion"

const MotionBox = motion(chakra.div)

type FadeTextProps = HTMLChakraProps<"div"> & MotionProps & {
    children?: React.ReactNode
}

export default function FadeAnimationText({ children, ...rest }: FadeTextProps) {
    return (
        <MotionBox
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                duration: 0.8,
                delay: 0.6,
                ease: [0, 0.71, 0.2, 1.01],
            }}
            {...rest}
        >
            {children}
        </MotionBox>
    )
}
