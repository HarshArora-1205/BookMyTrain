import { MdEdit } from "react-icons/md";
import Seat from "./seat";
import { Seat as TrainSeat } from "@/types/seat";

type GridProps = {
	seats: TrainSeat[];
	resetAllSeats: () => void;
	bookAllSeats: () => void;
	editMode: boolean;
	toggleMode: () => void;
	toggleBooking: (seat: number) => void;
};

const Grid = ({ seats, resetAllSeats, bookAllSeats, editMode, toggleMode, toggleBooking }: GridProps) => {
	return (
		<div className="w-fit flex flex-col gap-4">
			<div className="flex justify-between">
				{editMode && (
					<div className="flex gap-2">
						<button
							className="text-[10px] border h-6 w-12 tracking-wider select-none border-blue"
							onClick={resetAllSeats}
						>
							RESET
						</button>
						<button
							className="text-[10px] border h-6 w-20 tracking-wider select-none border-blue"
							onClick={bookAllSeats}
						>
							SELECT ALL
						</button>
					</div>
				)}

				<div className={`flex items-center gap-4 ${editMode ? "" : "ml-auto"}`}>
					<label
						htmlFor="editMode"
						className="text-[10px] cursor-pointer tracking-wider select-none"
					>
						EDIT MODE
					</label>
					<input
						className="hidden peer"
						type="checkbox"
						id="editMode"
						checked={editMode}
						onChange={toggleMode}
					/>
					<label
						className="flex items-center justify-start shadow-[inset_0px_0px_7.3px_3px_rgba(0,0,0,0.25)] w-10 border bg-gray border-blue h-6 p-1 cursor-pointer peer-checked:justify-end peer-checked:bg-blue"
						htmlFor="editMode"
					>
						<span className="w-4 h-4 flex justify-center items-center bg-sky text-blue">
							<MdEdit size={12} />
						</span>
					</label>
				</div>
			</div>
			<div className="grid w-fit grid-cols-7 gap-3">
				{seats.map((seat) => (
					<Seat
						key={seat.seatNumber}
						seat={seat}
						editMode={editMode}
						toggleBook={() => toggleBooking(seat.seatNumber)}
					/>
				))}
			</div>
		</div>
	);
};

export default Grid;
