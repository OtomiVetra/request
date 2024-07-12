import { useState } from 'react';

export const MyComponent = () => {
	const [value, setValue] = useState(0);
	const onClick = () => setValue(value + 1);

	return (
		<>
			<div>{value}</div>
			<button onClick={onClick}>Прибавить 1</button>
		</>
	);
};
