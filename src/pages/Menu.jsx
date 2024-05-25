import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Styled Components
const Container = styled.div`
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 20px auto;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-family: 'Roboto', sans-serif;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
  font-family: 'Roboto', sans-serif;
  @media (max-width: 600px) {
    font-size: 0.8rem;
  }
`;

const StyledThead = styled.thead`
  background-color: #34495e;
  color: white;
`;

const StyledTh = styled.th`
  padding: 15px;
  text-align: left;
  border-bottom: 2px solid #2c3e50;
`;

const StyledTd = styled.td`
  padding: 15px;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.3s ease;
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #ecf0f1;
    cursor: pointer;
    transform: scale(1.01);
  }
`;

const ChartContainer = styled.div`
  margin-top: 40px;
`;

const Statistics = () => {
  const [eventStats, setEventStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsCollection = collection(firebase.firestore(), 'events');
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventData = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const stats = eventData.map(event => ({
          eventName: event.eventName,
          yes: event.responses && event.responses['yes'] ? event.responses['yes'].length : 0,
          maybe: event.responses && event.responses['maybe'] ? event.responses['maybe'].length : 0,
          no: event.responses && event.responses['no'] ? event.responses['no'].length : 0,
        }));
        setEventStats(stats);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <Title>Event Statistics</Title>
      <StyledTable>
        <StyledThead>
          <tr>
            <StyledTh>Event Name</StyledTh>
            <StyledTh>Yes</StyledTh>
            <StyledTh>Maybe</StyledTh>
            <StyledTh>No</StyledTh>
          </tr>
        </StyledThead>
        <tbody>
          {eventStats.map((event, index) => (
            <TableRow key={index}>
              <StyledTd>{event.eventName}</StyledTd>
              <StyledTd>{event.yes}</StyledTd>
              <StyledTd>{event.maybe}</StyledTd>
              <StyledTd>{event.no}</StyledTd>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
      <ChartContainer>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={eventStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="eventName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="yes" fill="#4caf50" />
            <Bar dataKey="maybe" fill="#ff9800" />
            <Bar dataKey="no" fill="#f44336" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Container>
  );
};

export default Statistics;
