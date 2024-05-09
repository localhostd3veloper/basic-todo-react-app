export type TypeTodo = {
	text: string;
	createdOn: Date;
};

export const getLocalStorageData = () => {
	if (localStorage) {
		const data = localStorage.getItem('todoData');
		if (!data) return [];
		const formattedData = JSON.parse(data) as TypeTodo[];
		return formattedData;
	}
	return [];
};

export const setLocalStorageData = (newData: TypeTodo[]) => {
	if (localStorage) {
		localStorage.setItem('todoData', JSON.stringify(newData));
		return true;
	}
	return false;
};
