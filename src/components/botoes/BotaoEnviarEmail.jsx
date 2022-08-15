export default function BotaoEnviarEmail({ onClick=null, label = 'Enviar', className = ''}) {

    return (
        <button className={`
                text-blue-600 
                font-bold p-2 cursor-pointer rounded-md
                hover:shadow-md
                ${className}    
            `} 
            type="button"
            onClick={onClick}
        >
            <div className = 'flex items-center'>
                <i className='far fa-envelope' />
                {label ? <div className='ml-2'>{label}</div> : null}
            </div>
        </button>
    )
}