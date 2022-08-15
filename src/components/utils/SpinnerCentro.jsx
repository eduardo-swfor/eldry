import styles from '../../styles/Spinner.module.css'

export default function SpinnerCentro() {
    return (
        <div className={`
            justify-center items-center flex overflow-x-hidden 
            overflow-y-auto fixed inset-0 z-50 outline-none 
            focus:outline-none bg-gray-200 opacity-70
        `}>
            <div className={`
                ${styles.loader}
                ease-linear rounded-full border-8 
                border-t-8 border-gray-200 h-16 w-16
            `}/>
        </div>
    )
}