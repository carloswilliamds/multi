import { Column, Row, Align } from "./grid";
import {
  CalendarDayBlock,
  MonthDay,
  DayIndicatorContainer,
  WeekDay,
  HourContainer,
  RoomIndicator
} from "./calendar-styles";
import { Meeting, MeetingRoom, Time } from "../lib/models";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useState } from "react";
import { Room } from "./global-style";
import { css } from "styled-components";

const Calendar = () => {
  const [roomCheck, setRoomCheck] = useState();

  let calendarKey: any;
  const getCalendar = useQuery(
    gql`
      query calendar {
        calendar {
          date
          times {
            hour
            meetings {
              id
            }
          }
        }
      }
    `
  );
  const getRooms = useQuery(
    gql`
      query meetingRooms {
        meetingRooms {
          id
          color
        }
      }
    `
  );
  if (getCalendar.data) {
    calendarKey = getCalendar.data.calendar.reduce(
      (acc: { [date: string]: Meeting[] }, date: { date: string; meetings: Meeting[] }) => {
        acc[date.date] = date.meetings;
        return acc;
      },
      {}
    );
  }

  const calendarSize = 7;
  const daysNames = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
  const dates = Array.from({ length: calendarSize }).map((_, index: number) => {
    var currentDay = new Date();
    if (index > 0) {
      currentDay.setDate(currentDay.getDate() + index);
    }

    return {
      date: currentDay
    };
  });

  return (
    <Row space={0}>
      {renderHours()}
      {renderRows()}
    </Row>
  );

  function renderHours() {
    return (
      <Column
        decoration={css`
          margin-top: 53px;
        `}
      >
        {Array.from({ length: 24 }).map((_, index: number) => (
          <HourContainer key={index * Math.random() * 1000}>{index + ":00"}</HourContainer>
        ))}
      </Column>
    );
  }

  function renderRows() {
    if (!getCalendar.data || !getRooms.data) {
      return;
    }

    return Array.from({ length: getCalendar.data.calendar.length }).map((_, index: number) => {
      const cellDate = new Date();
      cellDate.setDate(cellDate.getDate() + index);
      cellDate.setSeconds(0);
      cellDate.setMilliseconds(0);
      cellDate.setUTCHours(index, 0, 0);

      return (
        <Column
          decoration={css`
            border-right: 1px solid lightgray;
            &:last-child {
              border-right: none;
            }
          `}
          key={index}
          mainAxis={Align.Center}
        >
          <DayIndicatorContainer>
            <WeekDay>{daysNames[cellDate.getDay()]}</WeekDay>
            <MonthDay current={new Date().toString() == cellDate.toString()}>{cellDate.getDate()}</MonthDay>
          </DayIndicatorContainer>
          {renderColumns(cellDate, index)}
        </Column>
      );
    });
  }

  function renderColumns(cellDate: Date, rowIndex: number) {
    if (!getCalendar.data) {
      return;
    }

    return (
      <CalendarDayBlock>
        {getCalendar.data.calendar[rowIndex].times.map((block: Array<Time>) => intervalCell(block))}
      </CalendarDayBlock>
    );
  }

  function intervalCell(time: Array<Time>) {
    return (
      <div style={{ width: "100%", borderTop: "1px solid lightgray" }}>
        {time.map(t => (
          <Row>
            {getRooms.data.meetingRooms.map((room: MeetingRoom, index: number) => (
              <RoomIndicator occuped={t.meetings.length > 0}>{renderRoom(room, index)}</RoomIndicator>
            ))}
          </Row>
        ))}
      </div>
    );
  }

  function renderRoom(room: MeetingRoom, index: number) {
    return <Row></Row>;
  }

  function dayBlockClickHandler(event: React.MouseEvent<HTMLElement, MouseEvent>) {
    console.log(event.currentTarget);
  }
};
export default Calendar;
