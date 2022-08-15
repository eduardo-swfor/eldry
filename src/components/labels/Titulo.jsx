export default function Titulo(props) {
    return (
        <h5 className={`text-gray-600 ${props.className} `}>
            {props.children}
        </h5>
    )
}