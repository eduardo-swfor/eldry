import { verificaPermissaoRequest } from '../pages/api/verifica-permissao'
import log from '../utils/app-log'

export { apiHandler }

function apiHandler(handler) {
    return async (req, res) => {
        try {
            if (!await verificaPermissaoRequest(req)){
                return res.status(401).end()
            }

            await handler(req, res)
        } catch (error) {
            log('*', error)
            return res.status(500).json({ erro: error?.message || error })
        }
    }
}