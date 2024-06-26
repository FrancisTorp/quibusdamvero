import { DEFAULT_UNITS, TimeTypes } from './constants';

/**
 * The duration of each time type in milliseconds
 */
const kTimeDurations: readonly [TimeTypes, number][] = [
	[TimeTypes.Year, 31536000000],
	// 29.53059 days is the official duration of a month: https://en.wikipedia.org/wiki/Month
	[TimeTypes.Month, 2628000000],
	[TimeTypes.Week, 1000 * 60 * 60 * 24 * 7],
	[TimeTypes.Day, 1000 * 60 * 60 * 24],
	[TimeTypes.Hour, 1000 * 60 * 60],
	[TimeTypes.Minute, 1000 * 60],
	[TimeTypes.Second, 1000]
];

/**
 * Display the duration
 * @param duration The duration in milliseconds to parse and display
 * @param assets The language assets
 */
export class DurationFormatter {
	public constructor(public units: DurationFormatAssetsTime = DEFAULT_UNITS) {}

	public format(duration: number, precision = 7) {
		const output: string[] = [];
		const negative = duration < 0;
		if (negative) duration *= -1;

		for (const [type, timeDuration] of kTimeDurations) {
			const substraction = duration / timeDuration;
			if (substraction < 1) continue;

			const floored = Math.floor(substraction);
			duration -= floored * timeDuration;
			output.push(addUnit(floored, this.units[type]));

			// If the output has enough precision, break
			if (output.length >= precision) break;
		}

		return `${negative ? '-' : ''}${output.join(' ') || addUnit(0, this.units.second)}`;
	}
}

/**
 * Adds an unit, if non zero
 * @param time The duration of said unit
 * @param unit The unit language assets
 */
function addUnit(time: number, unit: DurationFormatAssetsUnit) {
	if (Reflect.has(unit, time)) return `${time} ${Reflect.get(unit, time)}`;
	return `${time} ${unit.DEFAULT}`;
}

export interface DurationFormatAssetsUnit extends Record<number, string> {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	DEFAULT: string;
}

export interface DurationFormatAssetsTime {
	[TimeTypes.Second]: DurationFormatAssetsUnit;
	[TimeTypes.Minute]: DurationFormatAssetsUnit;
	[TimeTypes.Hour]: DurationFormatAssetsUnit;
	[TimeTypes.Day]: DurationFormatAssetsUnit;
	[TimeTypes.Week]: DurationFormatAssetsUnit;
	[TimeTypes.Month]: DurationFormatAssetsUnit;
	[TimeTypes.Year]: DurationFormatAssetsUnit;
}
