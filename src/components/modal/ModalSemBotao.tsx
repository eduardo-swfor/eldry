import { IconeX, IconeInfo } from '../icons'
import Titulo from '../labels/Titulo'

export interface ModalProps {
  titulo?: string
  conteudo: any
  tamanho?: string
  fechar?: () => void
}

export default function ModalSemBotao(props: ModalProps) {
  return (
    <>
      <div
        className={`
          justify-center items-center flex overflow-x-hidden 
          overflow-y-auto fixed inset-0 z-30 outline-none 
          focus:outline-none
        `}
      >
        <div className={`
          w-full md:w-10/12 my-2 mx-auto
        `}>
          <div className={`
            border-0 rounded-lg shadow-lg relative flex flex-col 
            w-full h-full bg-white outline-none focus:outline-none
          `}>
            {/*header*/}
            <div className={`
              flex items-start justify-between p-2 border-b 
              border-solid rounded-t bg-gray-400
            `}>
              <div className='flex pt-1 text-white'>
                {IconeInfo()}
                <Titulo className='ml-2 text-white'>
                  {props.titulo}
                </Titulo>
              </div>
              <button className={`
                  p-1 ml-auto border-0 text-white float-right
                  focus:outline-none focus:ring-2 focus:ring-gray-300 font-bold
                `}
                onClick={props.fechar}
              >
                {IconeX()}
              </button>
            </div>
            {/*body*/}
            <div className='relative p-2 flex-auto'>
              <div className='text-lg leading-relaxed'>
                {props.conteudo}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-20 bg-black"></div>
    </>
  )
}