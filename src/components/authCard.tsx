import { MdEmail, MdMail, MdOutlineFileCopy, MdPassword, MdPerson, MdPhone } from 'react-icons/md'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import 'swiper/css'
import React, { useEffect, useRef, useState } from 'react'
import api from '../services/api'
import { AxiosError, AxiosResponse } from 'axios'
import { useRouter } from 'next/router'
import Input from '../components/input'
import { cpfMask, phoneMask } from '../masks'

const loginSchema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email obrigatório'),
  password: yup.string().required('Senha obrigatória'),
})

const registerSchema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email obrigatório'),
  name: yup.string().required('Nome obrigatório'),
  cpf: yup
    .string()
    .required('CPF obrigatório')
    .matches(/[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[0-9]{2}/, 'Cpf inválido'),
  phone: yup
    .string()
    .required('Celular obrigatório')
    .matches(/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/, 'Telefone inválido'),
  password: yup.string().required('Senha obrigatório'),
  confirmPassword: yup
    .string()
    .required('Confirmação obrigatória')
    .oneOf([yup.ref('password'), null], 'Diferente de senha'),
})

export default function AuthCard(): JSX.Element {
  const [tabIndex, setTabIndex] = useState(0)
  const [error, setError] = useState<any>()
  const swiperRef = useRef<SwiperCore>()
  const router = useRouter()
  const {
    register,
    setValue,
    getValues,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, },
  } = useForm({ resolver: yupResolver(tabIndex === 0 ? loginSchema : registerSchema) })

  const onSubmit = (): Promise<void> => {
    setError(null)
    const endPoint = tabIndex === 0 ? '/auth/login' : '/auth/register'
    const data = tabIndex === 0 ? { username: getValues().email, ...getValues() } : getValues()
    delete data.confirmPassword
    return api.post(endPoint, data).then((res: AxiosResponse) => {
      localStorage.setItem('token', res.data.access_token)
      api.get('/users/me').then((res: AxiosResponse) => {
        if (res.data.role === 'USER') router.push('/user')
        else if (res.data.role === 'ADMIN') router.push('/admin')
      })
    }).catch((err: AxiosError) => {
      setError(err.response?.data)
    })
  }

  useEffect(() => {
    reset()
    setError(null)
  }, [reset, tabIndex])

  return (
    <div
    className={`bg-white transition-all duration-500 shadow-lg border rounded-xl w-full py-8 sm:w-[30rem] ${error?.message ? 'border-red-400' : 'border-transparent'}`}
    style={{ zIndex: 1000 }}
  >
    <div className="flex justify-center pb-8 pt-4">
      <img src="/logo.png" alt="vai-bem-logo" />
    </div>
    <div className="flex items-center px-6">
      <button
        className={`basis-full py-4 font-medium transition-all duration-500 border-b text-gray-700 text-sm ${tabIndex === 0 ? `border-primary` : 'border-transparent'}`}
        onClick={() => {
          swiperRef.current?.slideTo(0)
          setTabIndex(0)
        }}
      >
        ENTRAR
      </button>
      <button
        className={`basis-full py-4 font-medium transition-all duration-500 border-b text-gray-700 text-sm ${tabIndex === 1 ? `border-primary` : 'border-transparent'}`}
        onClick={() => {
          swiperRef.current?.slideTo(1)
          setTabIndex(1)
        }}
      >
        CADASTRAR
      </button>
    </div>
    <div className="px-6 mt-4">
      <span className="text-red-400">
        {error?.message && tabIndex === 0 ? 'Credenciais erradas.' :  error?.message ? 'Email já cadastrado' : ''}
      </span>
    </div>
    <Swiper
      onInit={(swiper: SwiperCore) => swiperRef.current = swiper}
      draggable={false}
      allowTouchMove={false}
    >
      <SwiperSlide>
        {tabIndex === 0 && (
          <div className="mt-12 px-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-10">
                <Input
                  type="text"
                  label="Email"
                  icon={<MdMail className="text-2xl text-gray-700" />}
                  register={register('email')}
                  error={errors.email}
                />
                <div>
                  <Input
                    type="password"
                    label="Senha"
                    icon={<MdPassword className="text-2xl text-gray-700" />}
                    register={register('password')}
                    error={errors.password}
                  />
                </div>
              </div>

              <div className="flex justify-end w-full mt-6">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="bg-primary text-white rounded-full px-5 font-medium w-full py-2 border border-primary transition-all duration-500 hover:bg-transparent hover:text-primary disabled:opacity-60"
                >
                  {isSubmitting ? 'ENTRANDO...' : 'ENTRAR'}
                </button>
              </div>
            </form>
          </div>
        )}
      </SwiperSlide>
      <SwiperSlide>
        {tabIndex === 1 && (
          <div className="mt-12 px-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-10">
                <div className="flex flex-col gap-y-12 items-center gap-x-4 sm:flex-row">
                  <Input
                    label="Email"
                    icon={<MdEmail className="text-2xl text-gray-700" />}
                    register={register('email')}
                    error={errors.email}
                  />
                  <Input
                    label="Nome Completo"
                    icon={<MdPerson className="text-2xl text-gray-700" />}
                    register={register('name')}
                    error={errors.name}
                  />
                </div>
                <div className="flex flex-col gap-y-8 items-center gap-x-4 sm:flex-row">
                  <Input
                    label="Celular"
                    icon={<MdPhone className="text-2xl text-gray-700" />}
                    register={{...register('phone'), maxLength: 15, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue('phone', phoneMask(e.currentTarget.value), { shouldValidate: true })}}
                    error={errors.phone}
                  />
                  <Input
                    label="CPF"
                    icon={<MdOutlineFileCopy className="text-2xl text-gray-700" />}
                    register={{...register('cpf'), onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue('cpf', cpfMask(e.currentTarget.value), { shouldValidate: true })}}
                    error={errors.cpf}
                  />
                </div>
                <div className="flex flex-col gap-y-8 items-center gap-x-4 sm:flex-row">
                  <Input
                    type="password"
                    label="Senha"
                    icon={<MdPassword className="text-2xl text-gray-700" />}
                    register={register('password')}
                    error={errors.password}
                  />
                  <Input
                    type="password"
                    label="Confirmar Senha"
                    icon={<MdPassword className="text-2xl text-gray-700" />}
                    register={register('confirmPassword')}
                    error={errors.confirmPassword}
                  />
                </div>
              </div>
              <div className="flex justify-end w-full mt-6">
              <button
                disabled={isSubmitting}
                type="submit"
                className="bg-primary text-white rounded-full px-5 font-medium w-full py-2 border border-primary transition-all duration-500 hover:bg-transparent hover:text-primary disabled:opacity-60"
              >
                {isSubmitting ? 'CADASTRANDO...' : 'Cadastrar'}
              </button>
            </div>
            </form>
          </div>
        )}
      </SwiperSlide>
    </Swiper>
  </div>
  )
}