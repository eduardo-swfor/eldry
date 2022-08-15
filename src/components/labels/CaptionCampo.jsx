export default function CaptionCampo(props) {
    return (
        <span className={`text-gray-600 text-sm ${props.className} `}>
            {props.children}
        </span>
    )
}