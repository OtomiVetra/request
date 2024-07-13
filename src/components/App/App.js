import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import styles from './App.module.css';
import { Form } from '../Form/Form';

export const App = () => {
	const [todos, setTodos] = useState([]);
	const [filterText, setFilterText] = useState('');
	const [isSorted, setIsSorted] = useState(false);

	const [isEditing, setIsEditing] = useState(false);
	const [currentTodo, setCurrentTodo] = useState({});

	useEffect(() => {
		fetch('http://localhost:3005/todos')
			.then((response) => response.json())
			.then((data) => setTodos(data))
			.catch((error) => console.error('что-то пошло не так:', error));
	}, []);

	const addTodoToList = (newTodo) => {
		setTodos((prevTodos) => [...prevTodos, newTodo]);
	};

	const updateTodoInList = (updatedTodo) => {
		setTodos((prevTodos) =>
			prevTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
		);
	};

	const removeTodoFromList = (id) => {
		setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
	};

	const deleteTodo = (id) => {
		fetch(`http://localhost:3005/todos/${id}`, {
			method: 'DELETE',
		})
			.then((response) => {
				if (response.ok) {
					removeTodoFromList(id);
				} else {
					console.error('Не удалось удалить дело');
				}
			})
			.catch((error) => console.error('что-то пошло не так:', error));
	};

	const editTodo = (todo) => {
		setIsEditing(true);
		setCurrentTodo({ ...todo });
	};

	const handleEditInputChange = (e) => {
		setCurrentTodo({ ...currentTodo, text: e.target.value });
	};

	const saveTodo = (e) => {
		e.preventDefault();
		fetch(`http://localhost:3005/todos/${currentTodo.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify(currentTodo),
		})
			.then((response) => response.json())
			.then((updatedTodo) => {
				updateTodoInList(updatedTodo);
				setIsEditing(false);
				setCurrentTodo({});
			})
			.catch((error) => console.error('что-то пошло не так:', error));
	};

	const filteredTodos = todos.filter((todo) =>
		todo.text.toLowerCase().includes(filterText.toLowerCase()),
	);

	const sortedTodos = isSorted
		? [...filteredTodos].sort((a, b) => a.text.localeCompare(b.text))
		: filteredTodos;

	const toggleSort = () => {
		setIsSorted((prevIsSorted) => !prevIsSorted);
	};

	const debouncedSearch = useCallback(
		debounce((value) => {
			setFilterText(value);
		}, 300),
		[],
	);

	const handleSearchInputChange = (e) => {
		debouncedSearch(e.target.value);
	};

	return (
		<div className={styles.app}>
			<div className={styles.todoListContainer}>
				<h1 className={styles.header}>Список дел</h1>
				<Form addTodoToList={addTodoToList} />
				<input
					type='text'
					placeholder='Поиск...'
					onChange={handleSearchInputChange}
					className={styles.searchInput}
				/>
				<button className={styles.button} onClick={toggleSort}>
					{isSorted ? '🔼' : '🔽'}
				</button>
				<ul className={styles.todoList}>
					{sortedTodos.map((todo) => (
						<li key={todo.id} className={styles.todoListItem}>
							{isEditing && currentTodo.id === todo.id ? (
								<form className={styles.editForm} onSubmit={saveTodo}>
									<input
										type='text'
										value={currentTodo.text}
										onChange={handleEditInputChange}
									/>
									<button type='submit'>✔️</button>
								</form>
							) : (
								<>
									<span className={styles.todoText}>{todo.text}</span>
									<div className={styles.buttonGroup}>
										<button className={styles.button} onClick={() => editTodo(todo)}>
											✏️
										</button>
										<button className={styles.button} onClick={() => deleteTodo(todo.id)}>
											❌
										</button>
									</div>
								</>
							)}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
