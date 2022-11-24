import Head from 'next/head'
import { Header } from '../components/Header'
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

      <Header />

      <main className={styles.main}>
        {!username ? (
          <span className='bg-gray-400 p-20 rounded-lg'>
            <div>
              <form>
                <input
                  onChange={e => setUnconfirmedUser(e.target.value)}
                  className='p-3 rounded mr-2 border border-black text-black'
                  placeholder='What is your username?'
                />
                <button
                  onClick={e => setUsername(unconfirmedUser)}
                  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded'
                >
                  Submit
                </button>
              </form>
            </div>
          </span>
        ) : (
          <span className='bg-gray-400 p-20 rounded-lg'>
            {' '}
            <div>
              <form className='relative w-full lg:max-w-sm'>
                {/* <select
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
                </select> */}
              </form>
              <input
                className='p-3 rounded mr-2 border border-black text-black'
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder='Message'
              />
              <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded'
                onClick={sendMessage}
              >
                Send
              </button>
              <h1 className='text-xl text-gray-800 mt-10 mb-2 pt-10 border-t-2 border-white font-bold'>
                Messages Received:
              </h1>
              <div className='text-xl'>
                {chat.map((data, index) => {
                  return (
                    <p className={'text-' + data.color + '-500'} key={index}>
                      <strong>{data.username}</strong>: {data.message}
                    </p>
                  )
                })}
              </div>
            </div>
          </span>
        )}
      </main>
    </div>
  )
}
