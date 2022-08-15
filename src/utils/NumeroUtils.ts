
export function formataNumeroMilhar(numero) {
    if (numero === null) {
        return ''
    }
    
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '').trim()
}

export function parseNumeroFormatado(numero: string) {
    if (!numero) {
        return null
    }

    return parseFloat(numero.toString().replaceAll(/\s/g, '').replaceAll('.', '').replaceAll(',', '.'))
}