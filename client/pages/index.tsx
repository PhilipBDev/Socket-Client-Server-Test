import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { useState, useEffect } from "react";
import * as io from "socket.io-client";

export default function Home() {
  const socket = io.connect("http://localhost:3001");

  const [unconfirmedUser, setUnconfirmedUser] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [receivedUsername, setReceivedUsername] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [mapMessage, setMapMessages] = useState(new Map());

    useEffect(() => {
    socket.on("receive_message", (data) => {
      setReceivedUsername(data.username);
      setMessageReceived(data.message);
         // const userPost = `${data.username}: ${data.message}`;
    });

    return (() => {
      socket.disconnect();
  })
    
  }, [socket])

  const sendMessage = () => {

    socket.emit("send_message", { 
      username,
      message 
    });
    setMessage("");
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Vibin'</title>
        <meta name="A simple chat application" content="Chat room and message board" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

{!username ? (
<>
    <div>
      <form>
       <input onChange={(e) => (setUnconfirmedUser(e.target.value))} className="border border-black mr-2" placeholder='What is your username?' />
       <button onClick={(e) => (setUsername(unconfirmedUser))} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button> 
       </form>
    </div>
</>
) : (
  <>
      <div>
        <input value={message} onChange={(e) => (setMessage(e.target.value))} className="border border-black mr-2" placeholder='Message' />
        <button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Send</button>  
        <h1 className="text-xl text- mt-3 mb-2 pt-2 border-t-2 border-black font-bold">
          Messages Received
        </h1>
      {!messageReceived ? (null) : (
        <div className="flex">
        <h2 className="text-red-500 font-bold">
          {receivedUsername}</h2>
        <p>: {messageReceived}</p>
        </div>
        )}

      </div>  
    </>
   )}

      </main>
    </div>
  )
}

