import { connectToDatabase } from './utils/mongodb'

export async function emailPermitido(email) {
    const dominios = await getDominiosPermitidos()

    if (dominios.filter(i => email.toUpperCase().endsWith(i.nome.toUpperCase())).length() > 0) {
        return true
    }

    return false
}

export async function getDominiosPermitidos() {
    const { db } = await connectToDatabase()

    const options = {
        "sort": {"nome": 1}
    }
           
    return await db
        .collection('dominios')
        .find(null, options)
        .toArray()
}

export default async function handlerCrud(req, res) {     

    if (req.method.toUpperCase() === 'GET') { 
        const dados = await getDominiosPermitidos()
        
        return res.status(200).json(dados.map(i => i.nome))
    } else {
        return res.status(405).json('NÃO PERMITIDO')
    }

}