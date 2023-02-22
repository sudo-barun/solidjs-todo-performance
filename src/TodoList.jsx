import { createSignal, For } from "solid-js";

function getTodoListItem(index)
{
	return {
		text: `Item ${index + 1}`,
		isCompleted: false,
	};
}

function getTodoList(count)
{
	return Array(count).fill().map((_, i) => getTodoListItem(i));
}

function truncateTodos(todos, total)
{
	if (todos.length > total) {
		const removeCount = todos.length - total;
		todos = todos.slice(0, total);
		todos.push(`${removeCount} items has been excluded.`);
		return todos;
	}
	return todos;
}

export default
function TodoList()
{
	const initial = getTodoList(10);
	const [todos, setTodos] = createSignal(initial);
	const [textElement, setTextElement] = createSignal();

	const [newTodo, setNewTodo] = createSignal('');

	function fillTodoList(count) {
		setTodos(getTodoList(count));
	}

	const data = () => JSON.stringify({
		newTodo: newTodo(),
		todos: truncateTodos(todos(), 20),
	}, null, 2)

	return (
		<div class="container mt-4 mb-5">
			<div class="row">
				<div class="col-xxl-10 mx-auto">
					<div class="row">
						<div class="col-lg-8">
							<h2>To-do list</h2>
							<div class="mb-4">
								Reset to-do list with 
								{[0, 5, 10, 50, 100, 500, 1000, 5000, 10000].map((count) => (
									<>
									<button
										class="btn btn-sm btn-outline-secondary"
										onClick={() => fillTodoList(count)}
									>
										{count}
									</button>
									{' '}
									</>
								))}
								items
							</div>
							<div class="row">
								<div class="col-md">
									<form
										class="input-group mb-3 w-75 mx-auto"
										onSubmit={(ev) => {
											ev.preventDefault();
											setTodos([{
												text: newTodo(),
												isCompleted: false,
											}].concat(todos()));
											setNewTodo('');
											textElement().value = '';
										}}
									>
										<input
											class="form-control"
											onInput={(ev) => setNewTodo(ev.target.value)}
											ref={setTextElement}
										/>
										<button
											type="submit"
											class="btn btn-outline-secondary"
											disabled={newTodo().trim()===''}
										>
											Add
										</button>
									</form>
								</div>
								<div class="col-md-auto">
									<button
										class="btn btn-outline-danger"
										disabled={!todos().some((todo) => todo.isCompleted)}
										onclick={() => {
											setTodos(todos().filter((todo) => !todo.isCompleted));
										}}
									>
										Remove completed
									</button>
								</div>
							</div>
							<div>
								<b>Total:</b>
								{' '}
								{todos().length}
							</div>
							<div class="list-group">
								<For each={todos()}>
									{(todo, index) => (
										<div class="list-group-item">
											<input
												type="checkbox"
												class="form-check-input"
												id={`todo-item-${index()}`}
												checked={todo.isCompleted}
												onChange={(ev) => {
													todo.isCompleted = ev.target.checked;
													setTodos(todos().slice());
												}}
											/>
											{' '}
											<label
												class="form-check-label"
												for={`todo-item-${index()}`}
											>
												{todo.text}
											</label>
											<button
												class="btn btn-sm btn-outline-danger float-end"
												onClick={() => {
													todos().splice(index(), 1);
													setTodos(todos().slice());
												}}
											>
												Remove
											</button>
										</div>
									)}
								</For>
							</div>
						</div>
						<div class="col-lg-4">
							<h5>Data</h5>
							<pre style="border: 1px solid #ccc; padding: 20px">
								<code>{data}</code>
							</pre>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
