import router from 'next/router'
import useAuth from '../../data/hook/useAuth'

export default function ForcarAutenticacao(props) {

    const { usuario, atualizaUsuario } = useAuth()

    function renderizarConteudo() {
        return (
            <>
                {props.children}
            </>
        )
    }

    if(usuario?.email) {
        atualizaUsuario()
        return renderizarConteudo()
    } else {        
        atualizaUsuario()
        //router.push('/auth/login')
        return null
    }
}