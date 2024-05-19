import { ChangeEvent, useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
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
	useEffect(() => {
		AOS.init({
			duration: 1500,
		});
	}, []);
	const todoTextInputChange = (e: ChangeEvent<HTMLInputElement>) =>
		setNewTodoInput(e.target.value);

	const addTodo = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newTodoInput) return;
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
		<main className="w-full h-full p-4 sm:p-6 lg:p-8">
			<section
				id="heroSection"
				className="w-full text-center space-y-4 sm:space-y-6"
			>
				<h3 className="text-2xl font-semibold" data-aos="fade-up">
					Welcome to{' '}
					<span className="font-power text-red-500">Tody</span> (
					Tooh-dee )
				</h3>
				<h1
					id="heroText-1"
					className="text-4xl space-x-2 sm:text-6xl lg:space-x-5 lg:text-8xl"
					data-aos="fade-up"
				>
					<span className="font-bold font-power">Achieve</span>
					<span className="material-symbols-outlined bg-red-500 rounded-full text-white px-2 py-1 text-xl sm:text-3xl lg:p-4 lg:text-5xl">
						north_east
					</span>
					<span>Like</span>
					<br />
					<span>Never</span>
					<span className="hidden sm:inline-block"> </span>
					<span className="font-bold font-power">Before</span>
				</h1>
				<h3 className="text-xl font-semibold lg:text-2xl">
					Use Tody and{' '}
					<span className="font-power bg-red-500 py-1 px-2 rounded-3xl text-white">
						Accomplish
					</span>{' '}
					your goals
				</h3>
			</section>
			<form
				className="mx-auto my-8 flex sm:w-10/12 lg:w-3/4 lg:w1/2"
				onSubmit={addTodo}
			>
				<input
					type="text"
					name="newTodo"
					id="newTodo"
					className="flex-1 pl-5 py-1.5 rounded-l-3xl  outline-none bg-orange-50 transition-colors hover:bg-red-50 focus:bg-red-50 shadow-sm"
					placeholder="Write down a new task..."
					value={newTodoInput}
					onChange={todoTextInputChange}
				/>
				<button
					type="submit"
					className="bg-red-500 rounded-r-3xl py-1.5 px-3 transition-colors hover:bg-red-400"
				>
					<span className="inline-block text-orange-50 text-2xl font-semibold align-top">
						&rarr;
					</span>
				</button>
			</form>
			<section className="mt-4 mx-auto sm:w-10/12 lg:w-3/4">
				<div
					id="filtersAndSortContainer"
					className="w-full h-full flex items-center gap-4"
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
					className="mt-4 w-full flex flex-col gap-4 overflow-y-scroll h-[43vh]"
				>
					{getFilteredTasks(todoList, filter).map((todo) => (
						<div
							id={`todo-${todo.uuid}`}
							key={todo.uuid}
							className="pb-2 border-b border-blue-950 flex items-center gap-2 cursor-pointer group"
						>
							<input
								type="checkbox"
								name={`todo-check-${todo.uuid}`}
								id={`todo-check-${todo.uuid}`}
								className="invisible w-4 h-4 checked:visible group-hover:visible accent-red-500"
								checked={todo.state === 'DONE'}
								onChange={toggleTodoState}
							/>
							<p
								id={`todo-text-${todo.uuid}`}
								className={`flex-1 outline-none font-medium ${
									todo.state === 'DONE' && 'line-through'
								}`}
							>
								{todo.text}
							</p>
							<button
								title={`Delete ${todo.text}`}
								type="button"
								className="border border-blue-950 px-3 py-2 rounded-md transition-colors hover:bg-red-50 hover:text-red-500"
								id={`todo-del-${todo.uuid}`}
								onClick={deleteTask}
							>
								<span className="material-symbols-outlined align-middle text-xl">
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
