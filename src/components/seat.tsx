"use client";
import { Seat as TrainSeat } from '@/types/seat';
import styled, { keyframes, css } from 'styled-components';
import React, { useEffect, useState } from 'react';

type Props = {
    seat: TrainSeat;
    editMode?: boolean;
    toggleSelect?: () => void;
    toggleBook?: () => void;
}

const shake = keyframes`
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
`;

const BookedSeatBox = styled.div<{ shakeAnimation?: boolean }>`
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
  
  ${({ shakeAnimation }) => shakeAnimation && css`
    animation: ${shake} 0.7s cubic-bezier(.36,.07,.19,.97) both;
  `}
`;

const SeatBox = styled.div<{ shakeAnimation?: boolean }>`
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
  
  ${({ shakeAnimation }) => shakeAnimation && css`
    animation: ${shake} 0.7s cubic-bezier(.36,.07,.19,.97) both;
  `}
`;

const Seat = ({ seat, editMode, toggleBook, toggleSelect }: Props) => {
    const [shouldShake, setShouldShake] = useState(false);

    useEffect(() => {
        if (editMode) {
            setShouldShake(true);
            const timer = setTimeout(() => setShouldShake(false), 700);
            return () => clearTimeout(timer); 
        }
    }, [editMode]);

    if (seat.booked && seat.currentlySelected) {
        return (
            <SeatBox
                shakeAnimation={shouldShake}
                className={`bg-blue text-sky ${editMode ? "cursor-pointer" : ""}`}
                onClick={editMode ? toggleBook : () => {}}
            >
                {editMode && (
                    <input
                        type="checkbox"
                        name="selected"
                        id="selected"
                        checked={seat.booked}
                        readOnly
                        className="absolute pointer-events-none top-1 left-1 rounded bg-sky text-gray outline-none focus:ring-0 focus:ring-offset-1 border-blue"
                    />
                )}
                <span className="text-sm text-sky font-bold select-none">{seat.seatNumber}</span>
            </SeatBox>
        );
    }

    if (seat.booked) {
        return (
            <BookedSeatBox
                shakeAnimation={shouldShake}
                onClick={editMode ? toggleBook : () => {}}
                className={editMode ? "cursor-pointer" : ""}
            >
                {editMode && (
                    <input
                        type="checkbox"
                        name="selected"
                        id="selected"
                        checked={seat.booked}
                        readOnly
                        className="absolute pointer-events-none top-1 left-1 rounded bg-sky text-blue outline-none focus:ring-0 focus:ring-offset-1 border-blue"
                    />
                )}
                <span className="text-sm text-blue font-bold select-none">{seat.seatNumber}</span>
            </BookedSeatBox>
        );
    }

    return (
        <SeatBox
            shakeAnimation={shouldShake}
            onClick={editMode ? toggleBook : () => {}}
            className={editMode ? "cursor-pointer" : ""}
        >
            {editMode && (
                <input
                    type="checkbox"
                    name="selected"
                    id="selected"
                    readOnly
                    checked={seat.booked}
                    className="absolute pointer-events-none top-1 left-1 rounded bg-sky text-blue outline-none focus:ring-0 focus:ring-offset-1 border-blue"
                />
            )}
            <span className="text-sm text-blue font-bold select-none">{seat.seatNumber}</span>
        </SeatBox>
    );
};

export default Seat;
