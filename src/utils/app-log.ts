export default function appLog(logLevel: string, mensagem: any) {
    if (logLevel === '*' || process.env.NEXT_PUBLIC_PERFIL_LOG) {
        const perfis = process.env.NEXT_PUBLIC_PERFIL_LOG.split(',')
        
        if (logLevel === '*' || perfis.filter(f => f === logLevel).length) {
            console.log(mensagem)
        }
    }
}