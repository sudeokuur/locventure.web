import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  background: url('/mnt/data/ialperen_resim.jpg') no-repeat center center;
  background-size: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  margin: 20px auto;
  backdrop-filter: blur(10px);
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
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  overflow: hidden;
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
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #ecf0f1;
    cursor: pointer;
    transform: scale(1.01);
  }
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
  
        const stats = eventData.map(event => {
          const responses = event.responses || {};
          const yesCount = responses ? Object.values(responses).filter(response => response === 'yes').length : 0;
          const maybeCount = responses ? Object.values(responses).filter(response => response === 'maybe').length : 0;
          const noCount = responses ? Object.values(responses).filter(response => response === 'no').length : 0;
          
          return {
            eventName: event.eventName,
            responses: {
              yes: yesCount,
              maybe: maybeCount,
              no: noCount,
            },
          };
        });
  
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
              <StyledTd>{event.responses.yes}</StyledTd>
              <StyledTd>{event.responses.maybe}</StyledTd>
              <StyledTd>{event.responses.no}</StyledTd>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </Container>
  );
};

export default Statistics;