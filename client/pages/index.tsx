import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { useState, useEffect } from "react";
import * as io from "socket.io-client";

export default function Home() {
  const socket = io.connect("http://localhost:3001");

  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message)
    });

    return (() => {
      socket.disconnect();
  })
    
  }, [socket])

  
  const sendMessage = () => {
    socket.emit("send_message", { message });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Vibin'</title>
        <meta name="A simple chat application" content="Chat room and message board" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

      <div>
        <input onChange={(e) => (setMessage(e.target.value))} className="border border-black mr-2" placeholder='Message' />
        <button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Send</button>  
        <h1 className="text-lg mt-3 pt-2 border-t-2 border-black">
          Messages Received:
        </h1>
        <p>{messageReceived}</p>
      </div>  
      

      </main>
    </div>
  )
}

