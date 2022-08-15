import FormLogin from '../../components/auth/FormLogin'
import FormCriarUsuario from '../../components/auth/FormCriarUsuario'
import FormEsqueceuSenha from '../../components/auth/FormEsqueceuSenha'
import { useState } from 'react'

export default function Login() {

    const [tela, setTela] = useState(0)

    async function alternaTela(tela) {
        setTela(tela)
    }

    const jsxTela = () => {
        if (tela == 1) {
            return (
                <FormEsqueceuSenha 
                    voltar={() => alternaTela(0)}
                />
            )   
        } else if (tela == 2) {
            return (
                <FormCriarUsuario 
                    voltar={() => alternaTela(0)}
                />
            )
        } else {
            return (
                <FormLogin 
                    novoUsuario={() => alternaTela(2)}
                    esqueceuSenha={() => alternaTela(1)}
                />
            )
        }    
    }

    return (
        <>
            <div className={`
                    w-screen h-screen opacity-60
                    fixed md:bg-gray-200
            `} />
            {jsxTela()}
        </>
    )
}