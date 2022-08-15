export default function TextoPequeno(props) {
    return (
        <div className={`text-gray-600 text-sm ${props.className} `}>
            {props.children}
        </div>
    )
}