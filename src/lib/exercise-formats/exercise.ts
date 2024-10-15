export interface Exercise {
	getBlock(): string;
	getTime(): string;
	getTitle(): Promise<string>;
	getInstructions(): string;
}
