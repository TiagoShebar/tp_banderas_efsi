import Image from "next/image";
import styles from "./page.module.css";
import Game from "@/pages/Game";
import { useState } from "react";

export default function Home() {
  const [scores, setScores] = useState(0);
  return (
    <main className={styles.main}>
      <Game setScores={setScores}/>
    </main>
  );
}
