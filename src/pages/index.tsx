import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'
import { useRouter } from 'next/router'
import AuthCard from '../components/authCard'
import { AxiosResponse } from 'axios'

const Home: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    api.get('/users/me').then((res: AxiosResponse) => {
      if (res.data.role === 'ADMIN') router.push('/admin')
      else router.push('/user')
    }).catch(() => {
    })
  }, [router])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Head>
        <title>Cartão Vai Bem - Autenticação</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="fixed w-[25rem] h-[25rem] rounded-full -left-28 -top-28 bg-primary"></div>

      <div className="min-h-screen flex flex-col items-center px-3 py-28 bg-gray-50 lg:py-20">
        <AuthCard />
      </div>

      <div className="fixed bottom-0 left-0 w-full">
        <div className="overflow-hidden">
          <svg
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
            xmlns="http://www.w3.org/2000/svg"
            style={{ fill: '#691DBC', width: '125%', height: 157, transform: 'rotate(180deg)' }}
          >
            <path
            d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z"
            opacity=".25"
          />
            <path
              d="M0 0v15.81c13 21.11 27.64 41.05 47.69 56.24C99.41 111.27 165 111 224.58 91.58c31.15-10.15 60.09-26.07 89.67-39.8 40.92-19 84.73-46 130.83-49.67 36.26-2.85 70.9 9.42 98.6 31.56 31.77 25.39 62.32 62 103.63 73 40.44 10.79 81.35-6.69 119.13-24.28s75.16-39 116.92-43.05c59.73-5.85 113.28 22.88 168.9 38.84 30.2 8.66 59 6.17 87.09-7.5 22.43-10.89 48-26.93 60.65-49.24V0z"
              opacity=".5"
            />
            <path d="M0 0v5.63C149.93 59 314.09 71.32 475.83 42.57c43-7.64 84.23-20.12 127.61-26.46 59-8.63 112.48 12.24 165.56 35.4C827.93 77.22 886 95.24 951.2 90c86.53-7 172.46-45.71 248.8-84.81V0z" />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}

export default Home
