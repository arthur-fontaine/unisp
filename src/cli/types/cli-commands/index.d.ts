export interface IndexAction {
	(files: string[], options: IndexOptions): Promise<void>;
}

interface IndexOptions {
	output: string;
}
