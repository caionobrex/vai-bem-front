import { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MdAdd, MdMail, MdPerson, MdPhone } from "react-icons/md";
import FloatingActionButton from "../../components/floatingActionButton";
import Menu from "../../components/menu";
import api from "../../services/api";
import swal from 'sweetalert'
import Drawer from "../../components/drawer";
import Input from "../../components/input";
import * as yup from 'yup'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Switch from "../../components/switch";
import { cpfMask, phoneMask } from "../../masks";
import AdminLayout from "../../components/adminLayout";

const schema = yup.object().shape({
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
  password: yup
    .string()
    .when('editing', {
      is: (editing: boolean) => !editing,
      then: (schema) => schema.required('Senha obrigatória'),
  }),
  confirmPassword: yup
    .string()
    .when('editing', {
      is: (editing: boolean) => !editing,
      then: (schema) => schema.required('Confirmação obrigatória').oneOf([yup.ref('password'), null], 'Diferente de senha'),
  }),
  editing: yup.boolean().default(false),
})

export default function Admin(): JSX.Element {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [editing, setEditing] = useState<number>(0)
  const router = useRouter()
  const {
      register,
      handleSubmit,
      getValues,
      setValue,
      reset,
      formState: { errors }
  } = useForm({ resolver: yupResolver(schema) })

  const onUpdateActive = (userId: number, isActive: boolean) => {
    api.patch(`/users/${userId}/active`, { active: isActive ? 1 : 0 })
    .then(() => {
      swal({
        title: 'Usuário atualizado com sucesso.',
        icon: 'success',
      })
    })
    .catch(console.log)
  }

  const onUpdateRole = (userId: number, role: string) => {
    api.patch(`/users/${userId}/role`, { role }).then(() => {
      swal({
        title: 'Usuário atualizado com sucesso.',
        icon: 'success',
      })
    })
  }

  const onDelete = (userId: number) => {
    swal({
      icon: 'warning',
      title: 'Você tem certeza ?',
      text: 'Você não pode desfazer uma ação de exclusão.',
      buttons: ['Cancelar', 'Deletar'],
      dangerMode: true,
    }).then((willDelete: boolean) => {
      if (willDelete) {
        api.delete(`/users/${userId}`).then(() => {
          setUsers((current) => current.filter((user) => user.id != userId))
          swal({ title: 'Deletado com sucesso!!', icon: 'success' })
        }).catch(() => {
          swal({ title: 'Error ao deletar o usuario.' })
        })
      }
    })
  }

  const onSubmit = (): Promise<void> => {
    const values = getValues()
    delete values.confirmPassword
    delete values.editing
    if (editing !== 0) {
      return api.put(`/users/${editing}`, values).then(() => {
        swal({ title: 'Usuario editado com sucesso!!', icon: 'success' })
      })
    }
    return api.post('/users', values).then((res: AxiosResponse) => {
      setUsers((current) => [...current, res.data])
      swal({ title: 'Usuario criado com sucesso!!', icon: 'success' })
      setIsDrawerOpen(false)
    })
  }

  useEffect(() => {
    api.get('/users/me').then((res: AxiosResponse) => {
      if (res.data.role !== 'ADMIN') router.push('/user')
      setLoading(false)
    }).catch(() => {
      router.push('/')
    })
  }, [loading, router])

  useEffect(() => {
    api.get('/users').then((res: AxiosResponse) => {
      setUsers(res.data.users)
    })
  }, [])

  useEffect(() => {
    setValue('editing', editing !== 0)
  }, [editing, setValue])

  if (loading) return <div></div>

  return (
    <AdminLayout>
      <div className="px-4 pt-10 pb-24">
        <div className="mx-auto md:w-[1000px]">
          <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>Celular</th>
                <th>Função</th>
                <th>Ativo</th>
                <th>Criado por</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <th>{user.id}</th>
                  <td>{user.email}</td>
                  <td>{user.name}</td>
                  <td>{user.cpf}</td>
                  <td>{user.phone}</td>
                  <td>
                    <select
                      className="bg-transparent"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onUpdateRole(user.id, e.currentTarget.value)}
                    >
                      <option value="ADMIN" selected={user.role === 'ADMIN'}>ADMIN</option>
                      <option value="USER" selected={user.role === 'USER'}>USER</option>
                    </select>
                  </td>
                  <td>
                    <Switch
                      defaultValue={user.active}
                      onChange={(isActive: boolean) => onUpdateActive(user.id, isActive)}
                    />
                  </td>
                  <td>
                    {user.createdUsers.length > 0 && (
                      <>
                        {user.createdUsers[0]?.createdBy?.name} ({user.createdUsers[0]?.createdBy?.id})
                      </>
                    )}
                  </td>
                  <td>
                    <Menu
                      onDelete={() => onDelete(user.id)}
                      onEdit={() => {
                        setIsDrawerOpen(true)
                        setEditing(user.id)
                        reset({
                          email: user.email,
                          name: user.name,
                          cpf: user.cpf,
                          phone: user.phone,
                          password: '',
                          confirmPassword: '',
                        })
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      <FloatingActionButton onClick={() => {
        setIsDrawerOpen(true)
        setEditing(0)
        reset({
          email: '',
          name: '',
          cpf: '',
          phone: '',
          password: '',
          confirmPassword: '',
        })
      }}>
        <MdAdd className="text-white text-2xl" />
      </FloatingActionButton>

      <Drawer
        isOpen={isDrawerOpen}
        className="w-[90%] md:w-[28rem]"
        onClose={() => setIsDrawerOpen(false)}
      >
        <div className="px-5 mt-10">
          <h2 className="text-3xl mb-8">
            {editing ? 'Editar Usuário' : 'Novo Usuário'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-4 md:flex-row md:items-center md:gap-x-5">
                <Input
                  label="Email"
                  icon={<MdMail />}
                  register={register('email')}
                  error={errors?.email}
                />
                <Input
                  label="Nome"
                  icon={<MdPerson />}
                  register={register('name')}
                  error={errors?.name}
                />
              </div>
              <div className="flex flex-col gap-y-4 md:flex-row md:items-center md:gap-x-5">
                <Input
                  label="Telefone"
                  icon={<MdPhone />}
                  register={{
                    ...register('phone'),
                    maxLength: 15, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue('phone', phoneMask(e.currentTarget.value), { shouldValidate: true })}}
                  error={errors?.phone}
                />
                <Input
                  label="CPF"
                  icon={<MdMail />}
                  register={{
                    ...register('cpf'),
                    maxLength: 15,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue('cpf', cpfMask(e.currentTarget.value), { shouldValidate: true })}}
                  error={errors?.cpf}
                />
              </div>
              <div className="flex flex-col gap-y-4 md:flex-row md:items-center md:gap-x-5">
                <Input
                  type="password"
                  label="Senha"
                  icon={<MdMail />}
                  register={register('password')}
                  error={errors?.password}
                />
                <Input
                  type="password"
                  label="Confirmar senha"
                  icon={<MdMail />}
                  register={register('confirmPassword')}
                  error={errors?.confirmPassword}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-full"
              >
                {editing ? 'Editar' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>
      </Drawer>
    </AdminLayout>
  )
}