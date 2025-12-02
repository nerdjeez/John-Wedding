export default function Todo({text, isCompleted, isDeleted = false}){
    if (isDeleted) {
        return null
    } else {
        return(
            <li>
                {text} {isCompleted && '✅'}
            </li>
        )
    }
}
/*export default function Todo({text, isCompleted, isDeleted = false}){
    if (isDeleted) {
        return null
    } else {
        return(
            <li>
                {isCompleted ? <del>{text}</del> : text}
            </li>
        )
    }
}*/
/*export default function Todo({text, isCompleted, isDeleted = false}){
    if (isDeleted) {
        return null
    } else if (isCompleted){
        return (
            <li>
                <del>{text}</del>
            </li>
        )
    } else {
        return (
            <li>
                {text}
            </li>
        )
    }
}*/