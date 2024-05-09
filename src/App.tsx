import { useRef, useState } from 'react';
import './App.scss';
import {
	TypeTodo,
	genUUID,
	getLocalStorageData,
	setLocalStorageData,
} from './helper';

function App() {
	const initialLocalStorageData = getLocalStorageData();
	const [todoList, setTodoList] = useState(initialLocalStorageData);
	const todoInputRef = useRef<HTMLInputElement>(null);

	const addTodo = (e: React.FormEvent) => {
		e.preventDefault();
		const newTodoObj: TypeTodo = {
			uuid: genUUID(),
			text: todoInputRef.current?.value ?? '',
			createdOn: new Date(),
		};
		setTodoList((prev) => {
			setLocalStorageData([...prev, newTodoObj]);
			return [...prev, newTodoObj];
		});
	};

	const removeTodo = (uuid: string) => {
		setTodoList((prev) => {
			const updatedList = prev.filter((val) => val.uuid !== uuid);
			setLocalStorageData(updatedList);
			return updatedList;
		});
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
					<div key={i}>
						<li>{todo.text}</li>
						<button
							type="button"
							onClick={() => {
								removeTodo(todo.uuid);
							}}
						>
							Delete
						</button>
					</div>
				))}
			</ul>
		</main>
	);
}

export default App;
