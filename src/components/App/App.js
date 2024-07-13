import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import styles from './App.module.css';
import { Form } from '../Form/Form';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { db } from '../../firebase';

export const App = () => {
	const [todos, setTodos] = useState([]);
	const [filterText, setFilterText] = useState('');
	const [isSorted, setIsSorted] = useState(false);

	const [isEditing, setIsEditing] = useState(false);
	const [currentTodo, setCurrentTodo] = useState({});

	useEffect(() => {
		const todoDbRef = ref(db, 'todos');
		onValue(todoDbRef, (snapshot) => {
			const loadedTodos = snapshot.val();
			if (loadedTodos) {
				const todoArray = Object.keys(loadedTodos).map((key) => ({
					id: key,
					...loadedTodos[key],
				}));
				setTodos(todoArray);
			} else {
				setTodos([]);
			}
		});
	}, []);

	const addTodoToList = (newTodo) => {
		const todoDbRef = ref(db, 'todos');
		push(todoDbRef, newTodo);
	};

	const updateTodoInList = (updatedTodo) => {
		const todoDbRef = ref(db, `todos/${updatedTodo.id}`);
		update(todoDbRef, updatedTodo);
	};

	const removeTodoFromList = (id) => {
		const todoDbRef = ref(db, `todos/${id}`);
		remove(todoDbRef);
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
		updateTodoInList(currentTodo);
		setIsEditing(false);
		setCurrentTodo({});
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
										<button
											className={styles.button}
											onClick={() => removeTodoFromList(todo.id)}
										>
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
