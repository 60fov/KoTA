import Link from "next/link";

import styles from "./Nav.module.scss";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

const PATHS = [
  { name: "follow along", route: "/follow" },
  { name: "word", route: "/word" },
  { name: "endless", route: "/endless" },
  { name: "versus", route: "/versus", soon: true },
]

export default function Nav() {
  const router = useRouter()

  const isActive = (path: typeof PATHS[number]) => path.route === router.pathname

  return (
    <div className={styles.base}>
      {PATHS.map(path => (
        <motion.div
          data-nav-item
          layoutId={path.name}
          key={path.route}>
          {isActive(path) && <motion.div
            data-nav-indicator
            transition={{
              type: "spring",
              bounce: 0.225,
              duration: 0.5
            }}
            layoutId={"nav-indicator"} />}
          <Link
            data-nav-item-text
            data-soon={path.soon}
            data-active={isActive(path)}
            href={path.route}
          >
            {path.name}
          </Link>
        </motion.div>
      ))}
    </div>
  )
}