import cores from '../data/cores.json'
import _ from 'lodash'

export function formataCnpj(cnpj) {
    if (!cnpj) return ''

    return cnpj.padStart(14, '0').replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
}

export function validaCnpj(cnpj) {
    if (process.env.NEXT_PUBLIC_DESABILITAR_VALIDACOES && process.env.NEXT_PUBLIC_DESABILITAR_VALIDACOES === 'true') {
        return true
    }

    cnpj = cnpj.replace(/[^\d]+/g,'')
 
    if(cnpj == '') return false
     
    if (cnpj.length != 14) {
        return false
    }
 
    // Elimina CNPJs invalidos conhecidos
    if (/*cnpj == "00000000000000" ||*/
        cnpj == "11111111111111" || 
        cnpj == "22222222222222" || 
        cnpj == "33333333333333" || 
        cnpj == "44444444444444" || 
        cnpj == "55555555555555" || 
        cnpj == "66666666666666" || 
        cnpj == "77777777777777" || 
        cnpj == "88888888888888" || 
        cnpj == "99999999999999")
        return false;
         
    // Valida DVs
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0,tamanho)
    let digitos = cnpj.substring(tamanho)
    let soma = 0
    let pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--

      if (pos < 2) {
          pos = 9
      }
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11

    if (resultado != digitos.charAt(0)) {
        return false
    }
         
    tamanho = tamanho + 1
    numeros = cnpj.substring(0,tamanho)
    soma = 0
    pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {      
        soma += numeros.charAt(tamanho - i) * pos--

      if (pos < 2) {
          pos = 9
      }
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11

    if (resultado != digitos.charAt(1)) {
        return false
    }
           
    return true   
}

export function geraArrayCores(tamanho) {
    return _.sampleSize(cores, tamanho)
}