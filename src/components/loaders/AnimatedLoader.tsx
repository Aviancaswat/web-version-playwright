import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import type React from 'react';

type IconLoaderProps = {
    width?: number,
    height?: number
}

const AnimatedLoader: React.FC<IconLoaderProps> = ({ height, width }) => {
    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, repeatType: 'loop', duration: 1, ease: 'linear' }}
        >
            <Loader width={width || 20} height={height || 20} />
        </motion.div>
    );
};

export default AnimatedLoader;