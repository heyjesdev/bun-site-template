import van from "./mini-van";

export function jsx(tag: keyof typeof van.tags | Function, props: any) {
	if (typeof tag === "function") {
		return tag(props);
	}

	const { children, ...attributes } = props ?? {};
	return van.tags[tag]!(attributes, ...[children].flat(Infinity));
}

export const jsxs = jsx;

export const Fragment = ({ children }: any) => children;