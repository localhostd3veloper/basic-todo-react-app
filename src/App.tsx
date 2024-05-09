import { useRef, useState } from 'react';
import './App.scss';
import { TypeTodo } from './helper';

function App() {
	const [todoList, setTodoList] = useState<TypeTodo[]>([]);
	const todoInputRef = useRef<HTMLInputElement>(null);

	const addTodo = (e: React.FormEvent) => {
		e.preventDefault();
		const newTodoObj: TypeTodo = {
			text: todoInputRef.current?.value ?? '',
			createdOn: new Date(),
		};
		setTodoList((prev) => [...prev, newTodoObj]);
	};

	return (
		<main>
			<form onSubmit={addTodo}>
				<input
					ref={todoInputRef}
					type="text"
					name="todoInput"
					id="todoInput"
				/>
				<button type="submit">Add todo</button>
			</form>
			<ul>
				{todoList.map((todo, i) => (
					<li key={i}>{todo.text}</li>
				))}
			</ul>
		</main>
	);
}

export default App;
