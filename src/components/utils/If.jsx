export default function If({exibir, children}) {
    return (
        <>
            {exibir ? children : null}
        </>
    )
}