import useAppData from '../../data/hook/useAppData'
import { IconeX, IconeInfo } from '../icons'
import BotaoRegular from '../botoes/BotaoRegular'
import Titulo from '../labels/Titulo'

interface ModalProps {
  titulo?: string
  conteudo: any
}

export default function Modal({titulo='', conteudo=null, tamanho=null}) {
  const {esconderModal} = useAppData()  

  return (
    <>
      {/* overflow-x-hidden  */}
      <div
        className={`
          justify-center items-center flex overflow-x-auto 
          overflow-y-auto fixed inset-0 z-50 outline-none 
          focus:outline-none
        `}
      >
        <div className={`
          ${tamanho ? tamanho : 'w-11/12 md:w-2/4'} my-6 mx-auto
        `}>
          <div className={`
            border-0 rounded-lg shadow-lg relative flex flex-col 
            w-full h-full bg-white outline-none focus:outline-none
          `}>
            {/*header*/}
            <div className={`
              flex items-start justify-between p-2 
              border-b border-solid rounded-t
            `}>
              <div className='flex'>
                {IconeInfo()}
                <Titulo className='ml-2'>
                  {titulo}
                </Titulo>
              </div>
              <button className={`
                  p-1 ml-auto border-0 text-black opacity-25 
                  float-right font-semibold outline-none focus:outline-none
                `}
                onClick={esconderModal}
              >
                {IconeX()}
              </button>
            </div>
            {/*body*/}
            <div className='relative p-2 flex-auto'>
              <div className='my-4 text-lg leading-relaxed'>
                {conteudo}
              </div>
            </div>

            {/*footer*/}
            <div className={`
              flex items-center justify-end p-2 border-t 
              border-solid border-blueGray-200 rounded-b
            `}>
              
              <BotaoRegular label='Sair' onClick={esconderModal} />
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}