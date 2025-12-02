export default function Container({children}){
    return (
        <div>
            <h1>Container</h1>
            {children}
            <footer>
                <p>Tes Container Footer</p>
            </footer>
        </div>
    )
}