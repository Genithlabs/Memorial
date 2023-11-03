export interface VisitorMessage {
	name: string;
	date: string;
	message: string;
}

export interface Memory {
	name: number;
	date: string;
	message: string;
}

export interface Detail {
	backgroundImage: string,
	profileImage: string,
	name: string,
	birth: string,
	contents: string,
}

export interface ALLProps {
	visitorMessages: VisitorMessage[];
	memories: Memory[];
	detail: Detail;
}

export interface LifeProps {
	visitorMessages: VisitorMessage[];
	detail: Detail;
}