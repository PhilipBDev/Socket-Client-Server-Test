import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { useState, useEffect } from 'react'
import * as io from 'socket.io-client'

export default function Home() {
  const socket = io.connect('http://localhost:3001')

  const [unconfirmedUser, setUnconfirmedUser] = useState('')
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')

  const [chat, setChat] = useState([])

  const colorOptions = ['black', 'blue', 'red', 'orange', 'pink']
  const [color, setColor] = useState(colorOptions[0])

  useEffect(() => {
    socket.on('receive_message', data => {
      setChat([...chat, data])
    })

    return () => {
      socket.disconnect()
    }
  }, [socket])

  const sendMessage = () => {
    let userPost = {
      username: username,
      message: message,
      color: color,
    }

    setChat([...chat, userPost])
    setMessage('')

    socket.emit('send_message', {
      username,
      message,
      color,
    })
  }

  const handleKeyPress = e => {
    if (e.keyCode === 13) {
      if (message) {
        sendMessage()
      }
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Vibin'</title>
        <meta
          name='A simple chat application'
          content='Chat room and message board'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        {!username ? (
          <>
            <div>
              <form>
                <input
                  onChange={e => setUnconfirmedUser(e.target.value)}
                  className='border border-black mr-2'
                  placeholder='What is your username?'
                />
                <button
                  onClick={e => setUsername(unconfirmedUser)}
                  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                >
                  Submit
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <div>
              <form className='relative w-full lg:max-w-sm'>
                <select
                  className='w-full p-2.5 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600'
                  value={color}
                  onChange={e => setColor(e.target.value)}
                >
                  {colorOptions.map(value => (
                    <option
                      className={'text-' + value + '-500'}
                      value={value}
                      key={value}
                    >
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </option>
                  ))}
                </select>
              </form>
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className='border border-black mr-2'
                placeholder='Message'
              />
              <button
                onClick={sendMessage}
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              >
                Send
              </button>
              <h1 className='text-xl text- mt-3 mb-2 pt-2 border-t-2 border-black font-bold'>
                Messages Received
              </h1>
              {chat.map((data, index) => {
                return (
                  <p className={'text-' + data.color + '-500'} key={index}>
                    {data.username}: {data.message}
                  </p>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
