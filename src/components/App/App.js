import { useState, useEffect } from 'react';
import styles from './App.module.css';

export const App = () => {
	const [todos, setTodos] = useState([]);

	useEffect(() => {
		fetch('https://jsonplaceholder.typicode.com/todos')
			.then((response) => response.json())
			.then((data) => setTodos(data))
			.catch((error) => console.error('что то пошло не так:', error));
	}, []);

	return (
		<div className={styles.app}>
			<div className={styles.todoListContainer}>
				<h1 className={styles.header}>TodoList</h1>
				<ul className={styles.todoList}>
					{todos.map((todo) => (
						<li key={todo.id} className={styles.todoListItem}>
							{todo.title}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
