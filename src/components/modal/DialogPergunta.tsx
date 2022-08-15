import useAppData from '../../data/hook/useAppData'
import { IconeX, IconeInterrogacao } from '../icons'
import Titulo from '../labels/Titulo'
import BotaoOk from '../botoes/BotaoOk'
import BotaoCancelar from '../botoes/BotaoCancelar'

export default function DialogPergunta({conteudo, cancelar = null, ok = null, sair}) {
  return (
    <>
      <div
        className={`
          justify-center items-center flex overflow-x-hidden 
          overflow-y-auto fixed inset-0 z-50 outline-none 
          focus:outline-none`}
      >
        <div className='w-11/12 md:w-1/3 my-6 mx-auto'>
          <div className={`
            border-0 rounded-lg shadow-lg relative flex flex-col 
            w-full bg-white outline-none focus:outline-none
          `}>
            {/*header*/}
            <div className={`
              flex items-start justify-between p-2 
              border-b border-solid rounded-t
            `}>
              <div className='flex'>
                {IconeInterrogacao()}
                <Titulo className='ml-2'>
                  Pergunta
                </Titulo>
              </div>
              <button className={`
                  p-1 ml-auto border-0 text-black opacity-25 
                  float-right font-semibold outline-none focus:outline-none
                `}
                onClick={sair}
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
              <BotaoCancelar invertido onClick={() => {
                if (cancelar) {
                  cancelar()
                }

                sair()
              }} />
              <BotaoOk className='ml-2' onClick={() => {
                if (ok) {
                  ok()
                }
                
                sair()
              }} />
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}