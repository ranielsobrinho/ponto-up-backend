const ISO_WITH_TZ = /([+-]\d{2}:\d{2}|Z)$/;

export function parseISODate(value: string): Date {
	return new Date(ISO_WITH_TZ.test(value) ? value : value + "Z");
}
