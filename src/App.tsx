import { ChangeEvent, useState } from 'react';
import {
	TypeFilters,
	TypeTodo,
	genUUID,
	getFilteredTasks,
	getLocalStorageData,
	setLocalStorageData,
} from './helper';

function App() {
	const initialLocalStorageData = getLocalStorageData();
	const [todoList, setTodoList] = useState(initialLocalStorageData);
	const [newTodoInput, setNewTodoInput] = useState('');
	const [filter, setFilter] = useState<TypeFilters>('ALL');

	const todoTextInputChange = (e: ChangeEvent<HTMLInputElement>) =>
		setNewTodoInput(e.target.value);

	const addTodo = (e: React.FormEvent) => {
		e.preventDefault();
		const newTodoObj: TypeTodo = {
			uuid: genUUID(),
			text: newTodoInput,
			state: 'ACTIVE',
		};
		setTodoList((prev) => {
			setLocalStorageData([...prev, newTodoObj]);
			return [...prev, newTodoObj];
		});
		setNewTodoInput('');
	};

	const toggleFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
		const btnText = e.currentTarget.innerText.toUpperCase() as TypeFilters;
		if (btnText === filter) return;
		setFilter(btnText);
	};

	const toggleTodoState = (e: React.ChangeEvent<HTMLInputElement>) => {
		const uuid = e.target.id.replace('todo-check-', '');
		setTodoList((prev) => {
			const prevTask = prev.find((val) => val.uuid === uuid);
			if (!prevTask) return prev;
			const updatedTask: TypeTodo = {
				...prevTask,
				state: prevTask.state === 'ACTIVE' ? 'DONE' : 'ACTIVE',
			};
			const filteredTasks = prev.filter((val) => val.uuid !== uuid);
			if (updatedTask.state === 'DONE')
				return [...filteredTasks, updatedTask];
			return [updatedTask, ...filteredTasks];
		});
	};

	const deleteTask = (e: React.MouseEvent<HTMLButtonElement>) => {
		const uuid = e.currentTarget.id.replace('todo-del-', '');
		setTodoList((prev) => prev.filter((val) => val.uuid !== uuid));
	};

	return (
		<main className="w-full p-8">
			<section id="heroSection" className="w-full text-center">
				<h3 className="text-2xl font-semibold">
					Welcome to Tody ( Tooh-dee )
				</h3>
				<h1 id="heroText-1" className="text-9xl space-x-10">
					<span className={`font-bold font-power`}>Achieve</span>
					<span className="text-6xl inline-block p-4 align-middle bg-red-500 rounded-full">
						&rarr;
					</span>
					<span>Like</span>
					<br />
					<span>Never</span>{' '}
					<span className={`font-bold font-power`}>Before</span>
				</h1>
				<h3 className="text-2xl font-semibold">
					Use Tody and{' '}
					<span className="font-power bg-red-500 py-1 px-2 rounded-3xl">
						Accomplish
					</span>{' '}
					your goals
				</h3>
			</section>
			<form className="w-1/2 mx-auto my-8 flex" onSubmit={addTodo}>
				<input
					type="text"
					name="newTodo"
					id="newTodo"
					className="flex-1 rounded-l-3xl px-3 outline-none bg-orange-50 transition-colors hover:bg-red-50 focus:bg-red-50"
					placeholder="write down a new task..."
					value={newTodoInput}
					onChange={todoTextInputChange}
				/>
				<button
					type="submit"
					className="bg-red-500 rounded-r-3xl py-1 px-3 transition-colors hover:bg-red-400"
				>
					<span className="inline-block text-orange-50 text-2xl font-semibold align-top">
						&rarr;
					</span>
				</button>
			</form>
			<section className="w-3/4 mt-4 mx-auto">
				<div
					id="filtersAndSortContainer"
					className="w-full flex items-center gap-4"
				>
					<button
						type="button"
						className={`px-3 border rounded-xl border-blue-950 transition-colors hover:bg-red-300 ${
							filter === 'ALL' ? 'bg-red-300' : ''
						}`}
						onClick={toggleFilter}
					>
						All
					</button>
					<button
						type="button"
						className={`px-3 border rounded-xl border-blue-950 transition-colors hover:bg-red-300 ${
							filter === 'ACTIVE' ? 'bg-red-300' : ''
						}`}
						onClick={toggleFilter}
					>
						Active
					</button>
					<button
						type="button"
						className={`px-3 border rounded-xl border-blue-950 transition-colors hover:bg-red-300 ${
							filter === 'DONE' ? 'bg-red-300' : ''
						}`}
						onClick={toggleFilter}
					>
						Done
					</button>
				</div>
				<div
					id="todoList"
					className="mt-4 w-full flex flex-col gap-4 overflow-y-auto"
				>
					{getFilteredTasks(todoList, filter).map((todo) => (
						<div
							id={`todo-${todo.uuid}`}
							key={todo.uuid}
							className="py-4 border-b border-blue-950 flex items-baseline gap-2 cursor-pointer group"
						>
							<input
								type="checkbox"
								name={`todo-check-${todo.uuid}`}
								id={`todo-check-${todo.uuid}`}
								className="invisible w-4 h-4 checked:visible group-hover:visible"
								checked={todo.state === 'DONE'}
								onChange={toggleTodoState}
							/>
							<p
								id={`todo-text-${todo.uuid}`}
								className="flex-1 outline-none"
							>
								{todo.text}
							</p>
							<button
								type="button"
								className="border border-blue-950 px-1 rounded-2xl transition-colors bg-red-100 hover:bg-red-300"
								id={`todo-del-${todo.uuid}`}
								onClick={deleteTask}
							>
								<span className="material-symbols-outlined align-middle text-lg">
									delete
								</span>
							</button>
						</div>
					))}
				</div>
			</section>
		</main>
	);
}

export default App;
