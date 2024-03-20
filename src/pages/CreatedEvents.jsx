import {
  collection,
  getDocs,
  orderBy,
  query,
} from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { firestore } from '../firebase';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ccc;

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 10px;
`;

const PageTitle = styled.h1`
  text-align: center;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 300px;
  padding: 10px;
  font-size: 16px;
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
`;

const CreatedEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadEvents = async () => {
    const eventsCollection = collection(firestore, 'events');
    let eventsQuery = query(eventsCollection);

    if (searchTerm) {
      eventsQuery = query(
        eventsCollection,
        orderBy('eventName'),
      );
    }

    const snapshot = await getDocs(eventsQuery);
    const eventsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setEvents(eventsData);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSearch = () => {
    loadEvents();
  };

  const formatDate = (timestamp) => {
    if (timestamp && timestamp.toDate instanceof Function) {
      const dateObject = timestamp.toDate();
      const formattedDate = dateObject.toLocaleDateString(); // Tarihi al
      const formattedTime = dateObject.toLocaleTimeString(); // Saati al
      return `${formattedDate} ${formattedTime}`; // Tarih ve saatleri birleştirerek döndür
    } else {
      return 'Invalid Date';
    }
  };
  const getStatus = (eventDate) => {
    const currentDate = new Date();
    const eventDateTime = eventDate.toDate();
    
    if (eventDateTime > currentDate) {
      return 'Visible';
    } else {
      return 'Done';
    }
  };

  return (
    <div>
      <PageTitle>Created Events</PageTitle>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search by event name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchButton onClick={handleSearch}>Search</SearchButton>
      </SearchContainer>

      <Table>
        <thead>
          <TableRow>
            <TableHeader>Event Name</TableHeader>
            <TableHeader>Address</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.eventName}</TableCell>
              <TableCell>{event.eventLocation}</TableCell>
              <TableCell>{event.eventType}</TableCell>
              <TableCell>{formatDate(event.eventDate)}</TableCell>
              <TableCell>{event.status}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CreatedEvents;
