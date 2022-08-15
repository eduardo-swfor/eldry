import jwt from 'jsonwebtoken'
import log from '../../../utils/app-log'

export async function verificaAutenticacao(req) {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        const verificacao = jwt.verify(token, process.env.JWT_SECRET)
            
        return verificacao.sub
    } catch (ex) {
        log('desenv', ex)
        return false
    }
}