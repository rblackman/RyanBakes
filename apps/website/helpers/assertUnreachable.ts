import throwError from "./throwError";

export default function assertUnreachable(_x: never): never {
	throwError("Didn't expect to get here");
}
