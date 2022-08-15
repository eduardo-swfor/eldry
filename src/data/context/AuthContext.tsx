import route, { useRouter } from 'next/router'
import { createContext, useEffect, useState } from 'react'
import Usuario from '../../model/Usuario'
import axios from 'axios'
import endpoints from '../endpoints.json'

interface AuthContextProps {
    usuario?: Usuario
    login?: (email: string, senha: string) => Promise<void>
    logout?: () => Promise<void>
    atualizaUsuario?: () => Promise<void>
    getUsuarioStorage?: () => Usuario
}

const AuthContext = createContext<AuthContextProps>({})

export function AuthProvider(props) {
    const [usuario, setUsuario] = useState<Usuario>(null)
    const router = useRouter()

    useEffect(() => {
        if (!usuario) {
            atualizaUsuario()
        }
    }, [usuario])

    async function configurarSessao(usuario) {
        if (usuario?.email) {
            const response = await axios.get(endpoints.DOM_PERM)
            const filtrado = response.data.filter(item => usuario.email.toUpperCase().endsWith(item.toUpperCase()))
            
            if (filtrado && filtrado.length > 0) {
                localStorage.setItem('usuario', JSON.stringify(usuario))
                setUsuario(usuario)
                return usuario.email
            } else {
                throw 'Domínio do usuário não permitido'
            }
        }

        localStorage.clear()
        setUsuario(null)
        return false
    }

    function getUsuarioStorage() {
        const usuarioLocal = localStorage.getItem('usuario')        
        return usuarioLocal ? JSON.parse(usuarioLocal) : null
    }

    async function atualizaUsuario() {
        let obj = localStorage.getItem('usuario')

        if (obj && !usuario) {
            const usuarioLogado = JSON.parse(obj)

            if (usuarioLogado?.email) {
                const retorno = await axios.post(endpoints.LOGIN, {token: usuarioLogado.token, email: usuarioLogado.email})
                const validador = retorno.data
                
                if (validador?.sub && validador?.sub.toUpperCase() === usuarioLogado.email.toUpperCase()) {
                    await configurarSessao(usuarioLogado)
                    
                    if (router.asPath === '/auth/login') {
                        route.push('/')
                    }
                } else if (validador && validador.message && validador.message.toUpperCase().indexOf('EXPIRED')) {
                    await configurarSessao(null)                    
                    route.push('/auth/login')
                }           
            }
        } else {
            let sair = true

            if (obj && usuario) {
                const usuarioLogado = JSON.parse(obj)
                
                if (usuarioLogado?.email === usuario.email) {
                    sair = false
                }
            }

            if (sair) logout()
        }
    }

    async function login(email, senha) {
        try {  
            const retorno = await axios.post(endpoints.LOGIN, {email, senha})
            const usuario = retorno.data
            
            if (typeof usuario == 'string') {
                throw usuario
            }

            await configurarSessao(usuario)
            route.push('/')
        } finally {
        }
    }

    async function logout() {
        try {          
            await configurarSessao(null)
            route.push('/auth/login')
        } finally {
        }
    }

    return (
        <AuthContext.Provider value={{
            usuario,
            login,
            logout,
            atualizaUsuario,
            getUsuarioStorage
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}


export default AuthContext