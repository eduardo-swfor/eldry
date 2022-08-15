import PermissaoEndpoint from './PermissaoEndpoint'
import PermissaoPagina from './PermissaoPagina'

export default interface Perfil {
    _id: string
    nome: string
    admin: boolean
    padrao: boolean
    permissaoPagina: PermissaoPagina
    permissaoEndpoint: PermissaoEndpoint
}