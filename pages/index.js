import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [newsInput, setNewsInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ news: newsInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setNewsInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Politik</title>
        <link rel="icon" href="/politik.png" />
      </Head>

      <main className={styles.main}>
        <img src="/politik.png" className={styles.icon} />
        <h3>Make News</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="topic"
            placeholder="Enter a News Topic"
            value={newsInput}
            onChange={(e) => setNewsInput(e.target.value)}
          />
          <input type="submit" value="Generate News" />
        </form>
        <center>
        <div className={styles.result}>{result}</div>
        </center>
      </main>
    </div>
  );
}
