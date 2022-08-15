import nodemailer from 'nodemailer'
import log from '../../../utils/app-log'


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: process.env.USUARIO_EMAIL.toLowerCase(),
    pass: process.env.SENHA_USUARIO_EMAIL
  },
})



export async function enviaEmail(destinatarios, assunto, corpo) {
    
    if (process.env.EMAIL_HABILITADO && process.env.EMAIL_HABILITADO === 'true' && process.env.USUARIO_EMAIL && process.env.SENHA_USUARIO_EMAIL) {
        
        try {
            await transporter.sendMail({
                from: `"Não responda" <${process.env.USUARIO_EMAIL}>`,
                to: destinatarios.toLowerCase(),
                subject: assunto,
                html: corpo
            })    
        } catch (error) {
            log('*', error)
        }
    }
}
