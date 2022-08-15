import FormAlteraSenha from '../components/auth/FormAlteraSenha'
import Layout from '../components/template/Layout'
import { IconeChave } from '../components/icons'
import useAuth from '../data/hook/useAuth'

export default function AlterarSenha() {

    const { usuario } = useAuth()

    return (
        <Layout titulo='Pesquisa de comprovantes' icone={IconeChave()}>
            <FormAlteraSenha 
                className='w-full'
                usuario={usuario}
            />
        </Layout>
    )

}