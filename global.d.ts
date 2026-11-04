declare module "*.css";

declare namespace JSX {
	type Element = any;

	interface IntrinsicElements {
		[tag: string]: any;
	}
}