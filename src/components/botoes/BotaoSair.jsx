import useAuth from '../../data/hook/useAuth'

export default function BotaoSair({className=null, tamanho=null, label='Sair'}) {

    const { logout } = useAuth()

    return (
        <button className={`
                text-gray-200
                ${className}
            `} 
            type="button"
            onClick={logout}
        >
            <div className = 'flex items-center'>
                {/*IconeSair(tamanho ? tamanho : 7)*/}
                <i className="fas fa-sign-out-alt" />
                {label ? <div className='ml-1'>{label}</div> : null}
            </div>
        </button>
    )
}