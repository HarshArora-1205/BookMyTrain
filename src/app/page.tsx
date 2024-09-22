"use client";

import Seat from "@/components/seat";
import { SiPeerlist } from "react-icons/si";
import { MdEdit } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import { Seat as TrainSeat } from "@/types/seat";
import { useEffect, useState } from "react";

export default function Home() {
  const [seats, setSeats] = useState<TrainSeat[]>([]);
  const [editMode, setEditMode] = useState<boolean> (false);

  useEffect(() => {
    const generatedSeats = Array.from({ length: 80 }, (_, i) => ({
      seatNumber: i + 1,
      booked: false,
      currentlySelected: false,
    }));

    setSeats(generatedSeats);
  }, []);

  const toggleSeatSelection = (seatNumber: number) => {
    setSeats((prevSeats) => {
      const index = seatNumber - 1;

      const updatedSeats = [...prevSeats];
      updatedSeats[index] = {
        ...updatedSeats[index],
        currentlySelected: !updatedSeats[index].currentlySelected,
      };
      return updatedSeats;
    });
  };

  const toggleSeatBooking = (seatNumber: number) => {
    setSeats((prevSeats) => {
      const index = seatNumber - 1;

      const updatedSeats = [...prevSeats];
      updatedSeats[index] = {
        ...updatedSeats[index],
        booked: !updatedSeats[index].booked,
      };
      return updatedSeats;
    });
  };

  const toggleMode = () => setEditMode(prev => !prev);

  return (
    <div className="flex flex-col items-center bg-sky text-blue font-bold justify-between container p-4">
      <main className="py-6">
        <div className="flex justify-between mb-4">
          {editMode && (
            <div className="flex gap-2">
              <button className="text-[10px] border h-6 w-12 tracking-wider select-none border-blue">RESET</button>
              <button className="text-[10px] border h-6 w-20 tracking-wider select-none border-blue">SELECT ALL</button>
            </div>
          )}

          <div className={`flex items-center gap-4 ${editMode ? "" : "ml-auto"}`}>
            <label htmlFor="editMode" className="text-[10px] cursor-pointer tracking-wider select-none">EDIT MODE</label>
            <input className="hidden peer" type="checkbox" id="editMode" checked={editMode} onChange={toggleMode}/>
            <label
              className="flex items-center justify-start shadow-[inset_0px_0px_7.3px_3px_rgba(0,0,0,0.25)] w-10 border bg-gray border-blue h-6 p-1 cursor-pointer peer-checked:justify-end peer-checked:bg-blue"
              htmlFor="editMode"
            >
              <span className="w-4 h-4 flex justify-center items-center bg-sky text-blue">
                <MdEdit size={12}/>
              </span>
            </label>
          </div>
          
        </div>
        <div className="grid grid-cols-7 gap-3">
          {seats.map((seat) => (
            <Seat key={seat.seatNumber} seat={seat} editMode={editMode} toggleBook={() => toggleSeatBooking(seat.seatNumber)} toggleSelect={() => toggleSeatSelection(seat.seatNumber)}/>
          ))}
        </div>
      </main>
      <footer className="w-full text-center flex flex-col gap-2 items-center">
        <div className="flex gap-8">
          <Link href={"https://github.com/HarshArora-1205"}>
            <FaGithub className="transform transition-transform duration-300 hover:translate-y-[-4px] filter hover:drop-shadow-md" size={24}/>
          </Link>
          <Link href={"https://www.linkedin.com/in/harsharora1205"}>
            <FaLinkedin className="transform transition-transform duration-300 hover:translate-y-[-4px] filter hover:drop-shadow-md" size={24}/>
          </Link>
          <Link href={"https://peerlist.io/knight1205"}>
            <SiPeerlist className="transform transition-transform duration-300 hover:translate-y-[-4px] filter hover:drop-shadow-md" size={24}/>
          </Link>
        </div>
        <h2 className="text-xs tracking-wider select-none">
          MADE WITH ❣ & 🧠️ BY HARSH ARORA  
        </h2>
      </footer>
    </div>
  );
}
