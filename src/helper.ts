import { v4 as uuidV4 } from 'uuid';

export type TypeTodo = {
	uuid: string;
	text: string;
	createdOn: Date;
};

export const genUUID = () => uuidV4().substring(0, 6);

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
