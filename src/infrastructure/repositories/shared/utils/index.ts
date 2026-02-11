export function extractField(detail?: string) {
	if (!detail) return null;

	const match = detail.match(/Key \(([^)]+)\)/);
	return match ? match[1] : null;
}
