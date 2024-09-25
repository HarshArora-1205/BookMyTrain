"use client";

import { ChangeEvent, useEffect, useState } from "react";

// Icons
import { MdEdit } from "react-icons/md";

// Types
import { Seat as TrainSeat } from "@/types/seat";

// Next Libraries
import Image from "next/image";
import { Libre_Barcode_39_Text } from "next/font/google";

// Import Assets
import ticket from "@/assets/ticket.png";
import logo from "@/assets/logo.png";

// Import Components 
import Seat from "@/components/seat";
import Legend from "@/components/legend";
import Preloader from "@/components/preloader";
import TicketBox from "@/components/ticketbox";
import Footer from "@/components/footer";

// Import Functions
import { findBestRow, findBestWindow } from "@/lib/book";
import { formatTimestamp } from "@/lib/utils";
import Grid from "@/components/grid";

const barcode = Libre_Barcode_39_Text({
	subsets: ["latin"],
	display: "swap",
	weight: ["400"],
});

export default function Home() {
	const [loading, setLoading] = useState(true);
	const [editMode, setEditMode] = useState<boolean>(false);

	// States to maintain train seats
	const [seats, setSeats] = useState<TrainSeat[]>([]);
	const [seatFreq, setSeatFreq] = useState<number[]>([
		7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 3,
	]);
	const [cap, setCap] = useState<number>(80);


	const [input, setInput] = useState<number>(1);
	const [helperText, setHelperText] = useState<string>("");

	const [bookedSeats, setBookedSeats] = useState<TrainSeat[]>([]);

	useEffect(() => {
		const generatedSeats = Array.from({ length: 80 }, (_, i) => ({
			seatNumber: i + 1,
			booked: false,
			currentlySelected: false,
		}));

		setSeats(generatedSeats);

		const timer = setTimeout(() => {
			setLoading(false);
		}, 2000);

		return () => clearTimeout(timer);
	}, []);

	if (loading) {
		return <Preloader />;
	}
	
	const resetInput = () => {
		setHelperText("");
		setInput(1);
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10);
		if (!value) {
			setHelperText("Value can't be null!");
		} else if (value < 1 || value > 7) {
			setHelperText("Value can't be greater than 7 or less than 1!");
		} else {
			setHelperText("");
		}
		setInput(value);
	};

	const bookSeat = (seat: number) => {
		const index = seat - 1;

		const newSeats = [...seats];
		newSeats[index].currentlySelected = true;
		newSeats[index].booked = true;

		setSeats(newSeats);
		setBookedSeats((prev) => [...prev, newSeats[index]]);
	};


	const bookInRow = (
		row: number,
		start: number,
		end: number,
		n: number
	) => {
		const newFreq = [...seatFreq];
		newFreq[row] = newFreq[row] - n;

		setSeatFreq(newFreq);
		setCap((prev) => prev - n);

		for (let i = start; i <= end; i++) {
			if (!seats[row * 7 + i].booked) bookSeat(row * 7 + i + 1);
		}
	};

	const bookInWindow = (left: number, right: number, k: number) => {
		for (let row = left; row <= right; row++) {
			const seatsInRow = row === 11 ? 3 : 7;
			for (let i = 0; i < seatsInRow; i++) {
				const seatIndex = row * 7 + i;

				if (!seats[seatIndex].booked) {
					bookSeat(seatIndex + 1);

					setSeatFreq((prevFreq) => {
						const newFreq = [...prevFreq];
						newFreq[row] -= 1;

						return newFreq;
					});

					setCap((prev) => prev - 1);

					k--;
					if (k === 0) return;
				}
			}
		}
	};

	const resetRecentBookings = () => {
		if (bookedSeats) {
			setSeats((prevSeats) => {
				let updatedSeats = [...prevSeats];

				bookedSeats.forEach((seat) => {
					const seatIndex = seat.seatNumber - 1;
					updatedSeats[seatIndex].currentlySelected = false;
				});

				return updatedSeats;
			});

			setBookedSeats([]);
		}
	};

	const book = () => {
		resetRecentBookings();

		if (input > cap) {
			setHelperText("Sorry! Not enough seats available!");
		} else if (input === cap) {
			for (let i = 0; i < seats.length && input > 0; i++) {
				if (!seats[i].booked) {
					const row = Math.floor(i / 7);
					bookSeat(i + 1);
					setSeatFreq((prevFreq) => {
						const newFreq = [...prevFreq];
						newFreq[row] -= 1;
						return newFreq;
					});

					setCap((prev) => prev - 1);
				}
			}
		} else {
			const [bestRow, start, end] = findBestRow(input, seats, seatFreq);
			if (bestRow !== -1) {
				bookInRow(bestRow, start, end, input);
				setHelperText(`Booked ${input} seats in row ${bestRow + 1}!`);
			} else {
				const [bestLeft, bestRight] = findBestWindow(input, seatFreq);

				if (bestLeft !== -1 && bestRight !== -1) {
					bookInWindow(bestLeft, bestRight, input);
					setHelperText(
						`Booked ${input} seats across rows ${bestLeft + 1} to ${
							bestRight + 1
						}`
					);
				} else {
					setHelperText("Sorry! Couldn't find enough seats together.");
				}
			}
		}
	};

	
	const resetSeats = () => {
		const newSeats = seats.map((seat) => ({
			...seat,
			booked: false,
			currentlySelected: false,
		}));
		setSeats(newSeats);
		setBookedSeats([]);
		setCap(80);
		setHelperText("");
		setSeatFreq([7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 3]);
	};

	const bookAllSeats = () => {
		const newSeats = seats.map((seat) => ({
			...seat,
			booked: true,
		}));
		setSeats(newSeats);
		setBookedSeats([]);
		setCap(0);
		setHelperText("");
		setSeatFreq([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	};


	const toggleSeatBooking = (seatNumber: number) => {
		const index = seatNumber - 1;
		const row = Math.floor(index / 7);
		if (seats[index].booked) {
			setCap((prev) => prev + 1);
			setSeatFreq((prevFreq) => {
				const newFreq = [...prevFreq];
				newFreq[row] += 1;
				return newFreq;
			});
		} else {
			setCap((prev) => prev - 1);
			setSeatFreq((prevFreq) => {
				const newFreq = [...prevFreq];
				newFreq[row] -= 1;
				return newFreq;
			});
		}

		setSeats((prevSeats) => {
			const updatedSeats = [...prevSeats];
			updatedSeats[index] = {
				...updatedSeats[index],
				booked: !updatedSeats[index].booked,
			};
			return updatedSeats;
		});
	};

	const toggleMode = () => setEditMode((prev) => !prev);


	return (
		<div className="flex flex-col items-center bg-sky text-blue font-bold justify-between w-full min-h-screen h-[100%] p-4">
			<main className="mb-4 lg:mb-0 py-4 flex flex-col-reverse lg:flex-row gap-8 items-center lg:gap-0 w-fit lg:w-full  justify-evenly">
				<Grid 
					seats={seats} 
					editMode={editMode}
					bookAllSeats={bookAllSeats}
					resetAllSeats={resetSeats}
					toggleMode={toggleMode}
					toggleBooking={toggleSeatBooking}
				/>
				<div className="flex flex-col">
					<div className="flex justify-between pr-4 mb-16">
						<div className="flex flex-col gap-2 tracking-wider select-none text-blue text-[10px]">
							<label htmlFor="bookinput" className="">
								ENTER NUMBER OF BOOKINGS
							</label>
							<input
								type="number"
								name="booking"
								id="bookinput"
								className="w-20 h-10 text-xs bg-transparent border-blue select-none"
								value={input}
								onChange={handleInputChange}
								min={1}
								max={7}
							/>
							<div className="flex gap-2">
								<button
									className="text-xs w-20 h-10 border tracking-wider select-none bg-blue text-sky border-blue shadow-xl hover:shadow-none hover:bg-indigo-900 disabled:bg-slate-500 disabled:text-fadeblue disabled:border-slate-500 disabled:cursor-not-allowed"
									disabled={!input || input < 1 || input > 7 || editMode}
									onClick={book}
								>
									BOOK
								</button>
								<button
									className="text-xs w-20 h-10 border tracking-wider select-none bg-transparent text-blue border-blue shadow-xl hover:shadow-none hover:bg-blue hover:text-sky disabled:bg-slate-500 disabled:text-fadeblue disabled:border-slate-500 disabled:cursor-not-allowed"
									onClick={resetInput}
									disabled={input === 1}
								>
									RESET
								</button>
							</div>
							<h4 className="text-xs font-medium text-red-600">{helperText}</h4>
						</div>
						<Image
							src={logo}
							className="select-none"
							alt="Logo"
							style={{ width: "160px", height: "80px" }}
						/>
					</div>
					<TicketBox>
						{bookedSeats && bookedSeats.length > 0 ? (
							<div>
								<div className="relative">
									<h5 className="text-[10px] absolute top-8 sm:top-16 left-10 sm:left-12 select-none">
										TOTAL PASSENGERS
									</h5>
									<h4 className="text-sm sm:text-lg absolute top-12 left-10 sm:left-12 sm:top-20 select-none">
										{bookedSeats.length}
									</h4>
									<h5 className="text-[10px]   absolute top-20 sm:top-[119px] left-10 sm:left-12 select-none">
										SEATS
									</h5>
									<h4 className="text-sm sm:text-lg absolute top-24 sm:top-[135px] left-10 sm:left-12 select-none">
										{bookedSeats.map((seat) => seat.seatNumber).join(" ")}
									</h4>
									<h6
										className={
											"absolute text-2xl sm:text-3xl top-32 sm:top-44 left-10 sm:left-12  select-none " +
											barcode.className
										}
									>
										{formatTimestamp(Date.now())}
									</h6>
									<Image
										draggable={false}
										className="select-none"
										src={ticket}
										alt="Ticket"
										width={512}
									/>
								</div>
							</div>
						) : (
							<h2 className="text-[10px] w-full lg:w-[512px] text-center tracking-wider select-none">
								YOUR TICKET WILL BE GENERATED HERE
							</h2>
						)}
					</TicketBox>
					<Legend />
				</div>
			</main>
			<Footer />
		</div>
	);
}
