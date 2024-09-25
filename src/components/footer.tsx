import { SiPeerlist } from "react-icons/si";
import { CgFigma } from "react-icons/cg";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import Link from "next/link";

const Footer = () => {
	return (
		<footer className="w-full text-center flex flex-col gap-2 items-center">
			<div className="flex gap-8">
				<Link href={"https://github.com/HarshArora-1205"}>
					<FaGithub
						className="transform transition-transform duration-300 hover:translate-y-[-4px] filter hover:drop-shadow-md"
						size={24}
					/>
				</Link>
				<Link href={"https://www.linkedin.com/in/harsharora1205"}>
					<FaLinkedin
						className="transform transition-transform duration-300 hover:translate-y-[-4px] filter hover:drop-shadow-md"
						size={24}
					/>
				</Link>
				<Link href={"https://peerlist.io/knight1205"}>
					<SiPeerlist
						className="transform transition-transform duration-300 hover:translate-y-[-4px] filter hover:drop-shadow-md"
						size={24}
					/>
				</Link>
				<Link href={"https://www.figma.com/design/nMYOSjREt78C9u3FscXECW/Assignments?node-id=52-3&t=GXodHw7VWvF3PvK0-1"}>
					<CgFigma
						className="transform transition-transform duration-300 hover:translate-y-[-4px] filter hover:drop-shadow-md"
						size={24}
					/>
				</Link>
			</div>
			<h2 className="text-xs tracking-wider select-none">
				MADE WITH ❣ & 🧠️ BY HARSH ARORA
			</h2>
		</footer>
	);
};

export default Footer;
