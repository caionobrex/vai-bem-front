import { MdClose, MdMenu, MdPerson } from 'react-icons/md'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Head from 'next/head'

interface SideBarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const SideBar = ({ isOpen, setIsOpen }: SideBarProps) => {
  const router = useRouter()

  return (
    <div
      className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} w-[80%] transition-all duration-500 md:translate-x-0 fixed flex flex-col justify-between h-full px-8 left-0 top-0 bg-gray-50 md:w-[18rem] py-10 shadow-md md:flex`}
      style={{ zIndex: 1000 }}
    >
      <MdClose className="absolute top-0 right-0 text-2xl md:hidden" onClick={() => setIsOpen(false)} />
      <div>
        <div className="flex justify-center">
          <img src="/logo.png" alt="vai-bem-logo" />
        </div>
        <ul className="mt-10">
          <li className="flex items-center gap-x-4">
            <MdPerson className="text-3xl text-primary" />
            <span className="text-xl">Usuários</span>
          </li>
        </ul>
      </div>
      <div>
        <button
          className="bg-red-400 text-white px-10 py-2 w-full rounded-full shadow-md"
          onClick={() => {
            localStorage.removeItem('token')
            router.push('/')
          }}
        >
          Sair
        </button>
      </div>
    </div>
  )
}

interface AdminLayoutProps {
  children?: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <>
      <Head>
        <title>Cartão Vai Bem - Admin</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <header className="bg-primary py-4 flex items-center justify-end shadow-md px-6 md:hidden">
          <MdMenu className="text-3xl text-white" onClick={() => setIsOpen(true)} />
        </header>

        <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />

        <main className="md:ml-[18rem]">
          {children}
        </main>
      </motion.div>
    </>
  )
}