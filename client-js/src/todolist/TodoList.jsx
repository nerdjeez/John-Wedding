import Todo from "./Todo.jsx";

export default function Todolist() {
    const data = [
        {
            id: 1,
            text : "Learn HTML",
            isCompleted : true
        },
        {
            id: 2,
            text : "Learn CSS",
            isCompleted : true
        },
        {
            id: 3,
            text : "Learn JavaScript",
            isCompleted : true
        },
        {
            id: 4,
            text : "Learn React",
            isCompleted : false
        }
    ]

    return (
        <ul>
            {data.map((todo) => (
                <Todo key={todo.id} {...todo}/>
            ))}
        </ul>
    )
}