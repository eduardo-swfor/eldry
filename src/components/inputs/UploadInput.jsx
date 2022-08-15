import { useRef, useState } from 'react'
import BotaoLimparTabela from '../botoes/BotaoLimparTabela'


export default function UploadInput({className='', limpar=null, adicionaArquivo = null, excluiArquivo = null, tamanhoMaximo = 5e6}) {
    const [arquivo, setArquivo] = useState({
        arquivo: null,
        nome: ''
    })
    const inputArquivo = useRef(null)

    return (
        <div className={className}>
            <input 
                type="file"
                ref={inputArquivo}
                onChange={event=>{ 
                    if (arquivo?.arquivo && removeArquivo) {
                        removeArquivo(arquivo)
                    }

                    const file = event.target.files[0]

                    if (file?.size > tamanhoMaximo) {
                        setArquivo({
                            arquivo: null,
                            nome: ''
                        })
                        inputArquivo.current.value = ''
                        
                        alerta('O arquivo não pode ter mais que 5MB')
                    } else {
                        const arq = {
                            arquivo: file,
                            nome: file.name
                        }

                        if (arq && adicionaArquivo) {
                            adicionaArquivo(arq)
                        }

                        setArquivo(arq)
                    }
                }}
            />
            {
                arquivo?.arquivo ?
                    <BotaoLimparTabela 
                        className='m2-2' 
                        onClick={() => {
                            excluiArquivo && excluiArquivo(arquivo)
                            
                            inputArquivo.current.value = ''
                            setArquivo({
                                arquivo: null,
                                nome: ''
                            })
                        }}
                    /> : 
                    null
            }            
        </div>
    )
}