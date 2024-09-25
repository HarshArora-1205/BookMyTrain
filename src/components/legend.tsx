import { Seat as TrainSeat } from "@/types/seat"
import Seat from "./seat"

const Legend = () => {

    const unbookedSeat: TrainSeat = {
        booked: false,
        currentlySelected: false,
        seatNumber: 1
    }

    const selectedSeat: TrainSeat = {
        booked: true,
        currentlySelected: true,
        seatNumber: 2
    }

    const bookedSeat: TrainSeat = {
        booked: true,
        currentlySelected: false,
        seatNumber: 3
    }

    return (
        <div className="flex my-4 gap-6 border-t-2 border-dashed pt-6 w-fit mt-12">
            <div className="cursor-help flex gap-2 items-baseline" title="Implies seat is available">
                <Seat seat={unbookedSeat}/>
                <h1 className="text-xs text-blue tracking-wider font-bold select-none">AVAILABLE</h1>
            </div>
            <div className="cursor-help flex gap-2 items-baseline" title="Implies seat is recently booked">
                <Seat seat={selectedSeat}/>
                <h1 className="text-xs text-blue tracking-wider font-bold select-none">SELECTED</h1>
            </div>
            <div className="cursor-help flex gap-2 items-baseline" title="Implies seat is unavailable">
                <Seat seat={bookedSeat}/>
                <h1 className="text-xs text-blue tracking-wider font-bold select-none">UNAVAILABLE</h1>
            </div>
        </div>
    )
}

export default Legend