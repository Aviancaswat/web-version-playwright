import { motion } from 'framer-motion';
import './shiny-text.css';

const ShinyTextAgent = () => (
    <motion.h6
        className="shiny-text"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
    >
       Pensando...
    </motion.h6>
);

export default ShinyTextAgent;