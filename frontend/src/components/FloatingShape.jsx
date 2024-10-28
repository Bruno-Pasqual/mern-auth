import { motion } from "framer-motion";

// eslint-disable-next-line react/prop-types
const FloatingShape = ({ color, size, top, left, delay }) => {
	return (
		<motion.div
			style={{ top: top, left: left }}
			className={`absolute rounded-full ${color} ${size}  opacity-20 blur-xl`}
			animate={{
				y: ["0%", "100%", "0%"],
				x: ["0%", "100%", "0%"],
				rotate: [0, 360],
			}}
			transition={{ repeat: Infinity, duration: 20, ease: "linear", delay: delay }}
			aria-hidden="true"
		/>
	);
};

export default FloatingShape;
