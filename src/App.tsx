import { useRef, useState } from 'react';
import './App.scss';
import {
	TypeTodo,
	genUUID,
	getFilteredTasks,
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
			state: 'NOT-STARTED',
		};
		setTodoList((prev) => {
			setLocalStorageData([...prev, newTodoObj]);
			return [...prev, newTodoObj];
		});
	};

	const modifyTodoState = (uuid: string, state: TypeTodo['state']) => {
		setTodoList((prev) => {
			const todo = prev.find((val) => val.uuid === uuid);
			if (todo) {
				const filteredList = prev.filter((val) => val.uuid !== uuid);
				todo.state = state;
				setLocalStorageData([...filteredList, todo]);
				return [...filteredList, todo];
			}
			return prev;
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
			<h1>Not-started</h1>
			<ul>
				{getFilteredTasks('NOT-STARTED', todoList).map((todo, i) => (
					<div key={i}>
						<li>{todo.text}</li>
						<button
							type="button"
							onClick={() => {
								modifyTodoState(todo.uuid, 'IN-PROGRESS');
							}}
						>
							MODIFY
						</button>
					</div>
				))}
			</ul>
			<h1>IN-PROGRESS</h1>
			<ul>
				{getFilteredTasks('IN-PROGRESS', todoList).map((todo, i) => (
					<div key={i}>
						<li>{todo.text}</li>
						<button
							type="button"
							onClick={() => {
								modifyTodoState(todo.uuid, 'COMPLETED');
							}}
						>
							MODIFY
						</button>
					</div>
				))}
			</ul>
			<h1>COMPLETED</h1>
			<ul>
				{getFilteredTasks('COMPLETED', todoList).map((todo, i) => (
					<div key={i}>
						<li>{todo.text}</li>
					</div>
				))}
			</ul>
		</main>
	);
}

export default App;
