import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Vibin'</title>
        <meta name="A simple chat application" content="Chat room and message board" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        
        <div className='font-bold'>
          Hello World!
        </div>

        </main>
    </div>
  )
}

