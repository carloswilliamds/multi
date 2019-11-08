import { NextPage } from "next";
import React from "react";
import { Container, Section, Room } from "../components/global-style";
import Layout from "../components/layout";
import { Row, Column } from "../components/grid";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { MeetingRoom } from "../lib/models";
import { withApollo } from "../lib/apollo";
import Calendar from "../components/calendar";

const MeetingRooms: NextPage = () => {
  return (
    <>
      <Layout>
        <Calendar></Calendar>
      </Layout>
    </>
  );
};

export default withApollo(MeetingRooms);
