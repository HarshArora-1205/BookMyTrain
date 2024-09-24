"use client";

import { Libre_Barcode_39_Text } from 'next/font/google'
import Seat from "@/components/seat";
import { SiPeerlist } from "react-icons/si";
import { MdEdit } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import { Seat as TrainSeat } from "@/types/seat";
import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import ticket from '../assets/ticket.png';
import logo from '../assets/logo.png';
import styled from "styled-components";
import Legend from "@/components/legend";

const barcode = Libre_Barcode_39_Text({
  subsets: ['latin'],
  display: 'swap',
  weight: ["400"],
})

export default function Home() {
  const [seats, setSeats] = useState<TrainSeat[]>([]);
  const [seatFreq, setSeatFreq] = useState<number[]>([7,7,7,7,7,7,7,7,7,7,7,3]);
  const [cap, setCap] = useState<number>(80);

  const [input, setInput] = useState<number>(1);
  const [helperText, setHelperText] = useState<string>('');

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10); 
    if(!value){
      setHelperText("Value can't be null!");
    } else if(value < 1 || value > 7){
      setHelperText("Value can't be greater than 7 or less than 1!");
    } else {
      setHelperText("");
    }
    setInput(value);
  };

  const bookSeat = (seat: number) => {
    const index = seat - 1;
    console.log("seat booked: ", seat);

    const newSeats = [...seats];
    newSeats[index].currentlySelected = true;
    newSeats[index].booked = true;
    
    setSeats(newSeats);
    setBookedSeats((prev) => [...prev, newSeats[index]]); 
  }
  
  const resetInput = () => {
    setHelperText("");
    setInput(1);
  }

  const allocateSeats = (row: number, start: number, end: number, n: number) => {
    console.log("old: ", seatFreq);
    console.log("--", row);
    const newFreq = [...seatFreq];
    newFreq[row] = newFreq[row] - n;
    console.log("new: ", newFreq);
    setSeatFreq(newFreq);
    setCap((prev) => prev-n);

    for (let i = start; i <= end; i++) {
      if(!seats[row * 7 + i].booked)
      bookSeat(row * 7 + i + 1);  
    }
  };

  const findBestRow = (n: number): [number, number, number] => {
    
    let bestRow = -1;
    let bestSpread = 8;
    let bestStart = -1, bestEnd = -1;
  
    for (let row = 0; row < 12; row++) {
      console.log(seatFreq[row])
      if (seatFreq[row] >= n) {
        const { spread, start, end } = findSpread(row, n);
        if (bestRow === -1 || seatFreq[row] < seatFreq[bestRow] || (seatFreq[row] === seatFreq[bestRow] && spread < bestSpread)) {
          bestRow = row;
          bestSpread = spread;
          bestStart = start;
          bestEnd = end;
        }
      }
    }
  
    return [bestRow, bestStart, bestEnd];
  };

  const findSpread = (row: number, n: number): { spread: number, start: number, end: number } => {
    let spread = 8;
    let availableSeats = 0;
    let left = 0;
    let bestStart = -1, bestEnd = -1;
  
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

  const findBestWindow = (k: number): [number, number] => {
    let left = 0, right = 0;
    let currentSum = 0;
    let minLength = Number.MAX_SAFE_INTEGER;
    let bestLeft = -1, bestRight = -1;
  
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

  const bookInWindow = (left: number, right: number, k: number) => {
    for (let row = left; row <= right; row++) {
      const seatsInRow = row === 11 ? 3 : 7; 
      for (let i = 0; i < seatsInRow; i++) {
        const seatIndex = row * 7 + i;
  
        if (!seats[seatIndex].booked) {
          bookSeat(seatIndex+1);

          setSeatFreq((prevFreq) => {
            const newFreq = [...prevFreq];
            newFreq[row] -= 1;

            return newFreq;
          });

          setCap(prev => prev-1);

          k--; 
          if (k === 0) return;
        }
      }
    }
  };

  const book = () => {
    resetRecentBookings();

    if(input > cap){
      setHelperText("Sorry! Not enough seats available!");
    } else if (input === cap){
      for (let i = 0; i < seats.length && input > 0; i++) {

        if (!seats[i].booked) {
          const row = Math.floor(i / 7);
          bookSeat(i + 1);
          setSeatFreq((prevFreq) => {
            const newFreq = [...prevFreq];
            newFreq[row] -= 1;
            return newFreq;
          });

          setCap(prev => prev-1);
        }
      }
    } else {
      const [bestRow, start, end] = findBestRow(input);
      if (bestRow !== -1) {
        allocateSeats(bestRow, start, end, input);  
        setHelperText(`Booked ${input} seats in row ${bestRow + 1}!`);
      } else {
        const [bestLeft, bestRight] = findBestWindow(input);
    
        if (bestLeft !== -1 && bestRight !== -1) {
          bookInWindow(bestLeft, bestRight, input);
          setHelperText(`Booked ${input} seats across rows ${bestLeft + 1} to ${bestRight + 1}`);
        } else {
          setHelperText("Sorry! Couldn't find enough seats together.");
        }
      }
    }
  }

  const resetRecentBookings = () => {
    if(bookedSeats) {
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
  

  const resetSeats = () => {
    const newSeats = seats.map(seat => ({
      ...seat,
      booked: false,
      currentlySelected: false,
    }));
    setSeats(newSeats);
    setBookedSeats([]);
    setCap(80);
    setHelperText("");
    setSeatFreq([7,7,7,7,7,7,7,7,7,7,7,3]);
  }

  const bookAllSeats = () => {
    const newSeats = seats.map(seat => ({
      ...seat,
      booked: true,
    }));
    setSeats(newSeats);
    setBookedSeats([]);
    setCap(0);
    setHelperText("");
    setSeatFreq([0,0,0,0,0,0,0,0,0,0,0,0]);
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
    const index = seatNumber - 1;
    const row = Math.floor(index / 7);
    if(seats[index].booked){
      setCap(prev => prev+1);
      setSeatFreq((prevFreq) => {
        const newFreq = [...prevFreq];
        newFreq[row] += 1;
        return newFreq;
      })
    } else {
      setCap(prev => prev-1);
      setSeatFreq((prevFreq) => {
        const newFreq = [...prevFreq];
        newFreq[row] -= 1;
        return newFreq;
      })
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

  const toggleMode = () => setEditMode(prev => !prev);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    console.log(date.toLocaleString());
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(',', '').replace(':', '-');
  };

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
              <input 
                type="number" 
                name="booking" 
                id="bookinput" 
                className="w-20 h-10 text-xs bg-transparent border-blue" 
                value={input} 
                onChange={handleInputChange}
                min={1} 
                max={7}
              />
              <div className="flex gap-2">
                <button
                  className="text-xs w-20 h-10 border tracking-wider select-none bg-blue text-sky border-blue disabled:bg-slate-500 disabled:text-fadeblue disabled:border-slate-500 disabled:cursor-not-allowed"
                  disabled={!input || input<1 || input>7 || editMode}
                  onClick={book}
                >
                  BOOK
                </button>
                <button
                  className="text-xs w-20 h-10 border tracking-wider select-none bg-transparent text-blue border-blue"
                  onClick={resetInput}
                >
                  RESET
                </button>
                
              </div>
              <h4 className="text-xs font-medium text-red-600">
                {helperText}
              </h4>
            </div>
            <Image src={logo} alt="Logo" style={{ width: '160px', height: '80px' }}/>
          </div>
          <TicketBox>
            {bookedSeats && bookedSeats.length > 0 ? (
              <div>
                <div className="relative">
                  <h5 className="text-[10px] absolute top-8 sm:top-16 left-10 sm:left-12">TOTAL PASSENGERS</h5>
                  <h4 className="text-sm sm:text-lg absolute top-12 left-10 sm:left-12 sm:top-20">{bookedSeats.length}</h4>
                  <h5 className="text-[10px]   absolute top-20 sm:top-[119px] left-10 sm:left-12">SEATS</h5>
                  <h4 className="text-sm sm:text-lg absolute top-24 sm:top-[135px] left-10 sm:left-12">
                    {bookedSeats.map(seat => seat.seatNumber).join(' ')}
                  </h4>
                  <h6 className={"absolute text-2xl sm:text-3xl top-32 sm:top-44 left-10 sm:left-12 " + barcode.className}>{formatTimestamp(Date.now())}</h6>
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
