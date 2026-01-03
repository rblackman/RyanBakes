import throwError from "./throw-error";

export default function assertUnreachable(_x: never): never {
	throwError("Didn't expect to get here");
}
