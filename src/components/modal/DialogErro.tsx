import { IconeX, IconeExclamacao } from '../icons'
import Titulo from '../labels/Titulo'
import BotaoFechar from '../botoes/BotaoFechar'
import { useState } from 'react'

export default function DialogErro({conteudo, sair = null, visivel = false}) {
  const [exibir, setExibir] = useState(visivel)

  return (
    !exibir ? 
      null :
      <>
        <div
          className={`
            justify-center items-center flex overflow-x-hidden 
            overflow-y-auto fixed inset-0 z-50 outline-none 
            focus:outline-none
          `}
        >
          <div className='w-11/12 md:w-1/3 my-6 mx-auto'>
            <div className={`
              border-0 rounded-lg shadow-lg relative flex flex-col 
              w-full outline-none focus:outline-none bg-gray-50
            `}>
              {/*header*/}
              <div className={`
                flex items-start justify-between p-2 bg-red-600
                rounded-t shadow-sm
              `}>
                <div className='flex text-white'>
                  {IconeExclamacao()}
                  <Titulo className='ml-2 text-white'>
                    Erro
                  </Titulo>
                </div>
                <button className={`
                    p-1 ml-auto border-0 text-black opacity-25 
                    float-right font-semibold outline-none focus:outline-none
                  `}
                  onClick={() => {
                    setExibir(false)

                    if (sair) {
                      sair()
                    }
                  }}
                >
                  <div className='text-white'>{IconeX()}</div>
                </button>
              </div>
              {/*body*/}
              <div className='relative p-2 flex-auto'>
                <div className='my-4 text-sm leading-relaxed'>
                  {conteudo}
                </div>
              </div>

              {/*footer*/}
              <div className={`
                flex items-center justify-end p-2 border-t 
                border-solid border-blueGray-200 rounded-b border-gray-300
              `}>
                <BotaoFechar onClick={() => {
                  setExibir(false)

                  if (sair) {
                    sair()
                  }
                }} />
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
  )
}