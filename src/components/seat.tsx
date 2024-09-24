"use client"
import { Seat as TrainSeat } from '@/types/seat';
import styled from 'styled-components';
import React from 'react';

type Props = {
    seat: TrainSeat;
    editMode?: boolean;
    toggleSelect?: () => void;
    toggleBook?: () => void;
}

const BookedSeatBox = styled.div`
  width: 44px;
  height: 44px;
  display: flex;
  background: repeating-linear-gradient(
    -45deg,
    #91AEC4,
    #91AEC4 5px,
    transparent 5px,
    transparent 10px
  );
  border: solid 1px #1C4980;
  border-radius: 8px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  position: relative;
  padding: 4px;
`;

const SeatBox = styled.div`
  width: 44px;
  height: 44px;
  display: flex;
  border: solid 1px #1C4980;
  border-radius: 8px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  position: relative;
  padding: 4px;
`;

const Seat = ({ seat, editMode, toggleBook, toggleSelect }: Props) => {
        if ( seat.booked && seat.currentlySelected) {
            return (
                <SeatBox 
                    className={`bg-blue text-sky ${editMode ? "cursor-pointer" : ""}`}
                    onClick={editMode ? toggleBook : () => {}}
                >
                    {
                        editMode && (
                            <input 
                                type="checkbox" 
                                name="selected" 
                                id="selected" 
                                checked={seat.booked}
                                readOnly
                                className="absolute pointer-events-none top-1 left-1 rounded bg-sky text-gray outline-none focus:ring-0 focus:ring-offset-1 border-blue"
                            />
                        )
                    }
                    <span className="text-sm text-sky font-bold select-none">{seat.seatNumber}</span>
                </SeatBox>
            );
        }

        if (seat.booked) {
            return (
                <BookedSeatBox
                    onClick={editMode ? toggleBook : () => {}}
                    className={editMode ? "cursor-pointer" : ""}
                >
                    {
                        editMode && (
                            <input 
                                type="checkbox" 
                                name="selected" 
                                id="selected" 
                                checked={seat.booked}
                                readOnly
                                className="absolute pointer-events-none top-1 left-1 rounded bg-sky text-blue outline-none focus:ring-0 focus:ring-offset-1 border-blue"
                            />
                        )
                    }
                    <span className="text-sm text-blue font-bold select-none">{seat.seatNumber}</span>
                </BookedSeatBox>
            );
        }
    
    
        return (
            <SeatBox
                onClick={editMode ? toggleBook : () => {}}
                className={editMode ? "cursor-pointer" : ""}
            >
                {
                    editMode && (
                        <input 
                            type="checkbox" 
                            name="selected" 
                            id="selected" 
                            readOnly
                            checked={seat.booked}
                            className="absolute pointer-events-none top-1 left-1 rounded bg-sky text-blue outline-none focus:ring-0 focus:ring-offset-1 border-blue"
                        />
                    )
                }
                <span className="text-sm text-blue font-bold select-none">{seat.seatNumber}</span>
            </SeatBox>
        );
    };

export default Seat