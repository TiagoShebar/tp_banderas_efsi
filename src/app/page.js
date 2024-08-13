import Image from "next/image";
import styles from "./page.module.css";
import Game from "@/pages/Game";

export default function Home() {
  return (
    <main className={styles.main}>
      <Game/>
    </main>
  );
}
