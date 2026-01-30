export function extractField(detail?: string) {
	if (!detail) return "field";

	const match = detail.match(/Key \(([^)]+)\)/);
	return match ? match[1] : null;
}
