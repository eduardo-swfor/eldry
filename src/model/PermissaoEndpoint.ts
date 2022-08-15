export default interface PermissaoEndpoint {
    rota: string
    get: boolean
    post: boolean
    put: boolean
    delete: boolean
}