"use client";

import Seat from "@/components/seat";
import { SiPeerlist } from "react-icons/si";
import { MdEdit } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import { Seat as TrainSeat } from "@/types/seat";
import { useEffect, useState } from "react";
import Image from "next/image";
import ticket from '../assets/ticket.png';
import logo from '../assets/logo.png';
import styled from "styled-components";
import Legend from "@/components/legend";

export default function Home() {
  const [seats, setSeats] = useState<TrainSeat[]>([]);
  const [bookedSeats, setBookedSeats] = useState<TrainSeat[]>([]);
  const [editMode, setEditMode] = useState<boolean> (false);

  useEffect(() => {
    const generatedSeats = Array.from({ length: 80 }, (_, i) => ({
      seatNumber: i + 1,
      booked: false,
      currentlySelected: false,
    }));

    setSeats(generatedSeats);
  }, []);

  const resetSeats = () => {
    const newSeats = seats.map(seat => ({
      ...seat,
      booked: false,
      currentlySelected: false,
    }));
    setSeats(newSeats);
  }

  const bookAllSeats = () => {
    const newSeats = seats.map(seat => ({
      ...seat,
      booked: true,
    }));
    setSeats(newSeats);
  }

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

  const TicketBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed #1C4980;
    border-radius: 2px;
    padding: 24px;
  `;

  return (
    <div className="flex flex-col items-center bg-sky text-blue font-bold justify-between w-full h-[100%] p-4">
      <main className="mb-4 lg:mb-0 py-4 flex flex-col-reverse lg:flex-row gap-8 items-center lg:gap-0 w-fit lg:w-full  justify-evenly">
        <div className="w-fit">
          <div className="flex justify-between mb-4">
            {editMode && (
              <div className="flex gap-2">
                <button 
                  className="text-[10px] border h-6 w-12 tracking-wider select-none border-blue"
                  onClick={resetSeats}
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
          <div className="grid w-fit grid-cols-7 gap-3">
            {seats.map((seat) => (
              <Seat key={seat.seatNumber} seat={seat} editMode={editMode} toggleBook={() => toggleSeatBooking(seat.seatNumber)} toggleSelect={() => toggleSeatSelection(seat.seatNumber)}/>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between pr-4 mb-16">
            <div className="flex flex-col gap-2 tracking-wider select-none text-blue text-[10px]">
              <label htmlFor="bookinput" className="">ENTER NUMBER OF BOOKINGS</label>
              <input type="number" name="booking" id="bookinput" className="w-20 h-10 text-xs bg-transparent border-blue" defaultValue={1} min={1} max={7}/>
              <div className="flex gap-2">
                <button
                  className="text-xs w-20 h-10 border tracking-wider select-none bg-blue text-sky border-blue"
                >
                  BOOK
                </button>
                <button
                  className="text-xs w-20 h-10 border tracking-wider select-none bg-transparent text-blue border-blue"
                >
                  RESET
                </button>
                
              </div>
            </div>
            <Image src={logo} alt="Logo" style={{ width: '160px', height: '80px' }}/>
          </div>
          <TicketBox>
            {bookedSeats && bookedSeats.length > 0 ? (
              <div>
                <div className="relative">
                  <h5 className="text-[10px] absolute top-12 sm:top-16 left-12">TOTAL PASSENGERS</h5>
                  <h4 className="text-sm sm:text-lg absolute top-16 left-12 sm:top-20">{bookedSeats.length}</h4>
                  <h5 className="text-[10px]   absolute top-24 sm:top-32 left-12">SEATS</h5>
                  <h4 className="text-sm sm:text-lg absolute top-28 sm:top-36 left-12">
                    {bookedSeats.map(seat => seat.seatNumber).join(' ')}
                  </h4>
                  <Image draggable={false} className="select-none" src={ticket} alt="Ticket" width={512} />
                </div>
              </div>
            ) : (
              <h2 className="text-[10px] w-full lg:w-[512px] text-center">YOUR TICKET WILL BE GENERATED HERE</h2>
            )}
          </TicketBox>
          <Legend />
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
