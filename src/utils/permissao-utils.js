import dados from '../data/permissoes.json'

export function getEstruturaPermissoes() {
    return { 
        paginas: dados.paginas.map(i => {
            return {
                route: i,
                permitido: false
            }
        }),
        endpoints: dados.endpoints.map(i => {
            return {
                route: i,
                get: false,
                post: false,
                put: false,
                delete: false
            }
        })
    }
}