import { Seat } from "@/types/seat";

export const findBestRow = (
	n: number,
	seats: Seat[],
	seatFreq: number[]
): [number, number, number] => {
	let bestRow = -1;
	let bestSpread = 8;
	let bestStart = -1,
		bestEnd = -1;

	for (let row = 0; row < 12; row++) {
		if (seatFreq[row] >= n) {
			const { spread, start, end } = findSpread(row, n, seats);
			if (
				bestRow === -1 ||
				seatFreq[row] < seatFreq[bestRow] ||
				(seatFreq[row] === seatFreq[bestRow] && spread < bestSpread)
			) {
				bestRow = row;
				bestSpread = spread;
				bestStart = start;
				bestEnd = end;
			}
		}
	}

	return [bestRow, bestStart, bestEnd];
};

const findSpread = (
	row: number,
	n: number,
	seats: Seat[]
): { spread: number; start: number; end: number } => {
	let spread = 8;
	let availableSeats = 0;
	let left = 0;
	let bestStart = -1,
		bestEnd = -1;

	const seatsInRow = row === 11 ? 3 : 7;

	for (let right = 0; right < seatsInRow; right++) {
		const seatNumber = row * 7 + right;
		if (!seats[seatNumber].booked) {
			availableSeats++;
		}

		while (availableSeats >= n) {
			if (spread > right - left + 1) {
				spread = right - left + 1;
				bestStart = left;
				bestEnd = right;
			}

			if (!seats[row * 7 + left].booked) {
				availableSeats--;
			}
			left++;
		}
	}

	return { spread, start: bestStart, end: bestEnd };
};


export const findBestWindow = (k: number, seatFreq: number[]): [number, number] => {
	let left = 0,
		right = 0;
	let currentSum = 0;
	let minLength = Number.MAX_SAFE_INTEGER;
	let bestLeft = -1,
		bestRight = -1;

	while (right < 12) {
		currentSum += seatFreq[right];

		while (currentSum >= k) {
			if (right - left + 1 < minLength) {
				minLength = right - left + 1;
				bestLeft = left;
				bestRight = right;
			}
			currentSum -= seatFreq[left];
			left++;
		}

		right++;
	}

	return [bestLeft, bestRight];
};
