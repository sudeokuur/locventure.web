import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc
} from 'firebase/firestore';
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
  color: ${(props) => (props.current ? '#00cc00' : '#00008b')};
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

const EditButton = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px; /* Added margin */
`;

const UploadInput = styled.input`
  margin-top: 10px;
`;

const CreatedEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editEvent, setEditEvent] = useState(null);

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

  const handleEdit = (eventId) => {
    const eventToEdit = events.find((event) => event.id === eventId);
    setEditEvent(eventToEdit);
  };

  const handleSaveEdit = async () => {
    try {
      const eventDocRef = doc(firestore, 'events', editEvent.id);
      await updateDoc(eventDocRef, {
        eventName: editEvent.eventName,
        eventLocation: editEvent.eventLocation,
        eventType: editEvent.eventType,
        eventDate: editEvent.eventDate,
        // Add other fields you want to update
      });
      setEditEvent(null);
      loadEvents();
    } catch (error) {
      console.error('Error updating event:', error);
    }
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
    return eventDateTime > currentDate ? 'CURRENT' : 'PAST';
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
            <TableHeader>Time</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Edit Event</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.eventName}</TableCell>
              <TableCell>{event.eventLocation}</TableCell>
              <TableCell>{event.eventType}</TableCell>
              <TableCell>{formatDate(event.eventDate)}</TableCell>
              <TableCell>{event.eventTime}</TableCell>
              <TableCell current={getStatus(event.eventDate) === 'CURRENT'}>
                {getStatus(event.eventDate)}
              </TableCell>
              <TableCell>
                <EditButton onClick={() => handleEdit(event.id)}>Edit</EditButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      {/* Edit Form */}
      {editEvent && (
         <div>
         <h2>Edit Event</h2>
         <form>
           <div>
             <label>Event Name:</label>
             <input
               type="text"
               value={editEvent.eventName}
               onChange={(e) => setEditEvent({ ...editEvent, eventName: e.target.value })}
             />
           </div>
           <div>
             <label>Event Date:</label>
             <input
               type="date"
               value={editEvent.eventDate.toDate().toISOString().substr(0, 10)} // Convert Firestore Timestamp to Date string
               onChange={(e) => setEditEvent({ ...editEvent, eventDate: new Date(e.target.value) })}
             />
           </div>
           <div>
             <label>Event Time:</label>
             <input
               type="time"
               value={editEvent.eventTime} // Assuming eventTime is a string in HH:mm format
               onChange={(e) => setEditEvent({ ...editEvent, eventTime: e.target.value })}
             />
           </div>
           <div>
             <label>Event Type:</label>
             <input
               type="text"
               value={editEvent.eventType}
               onChange={(e) => setEditEvent({ ...editEvent, eventType: e.target.value })}
             />
           </div>
           <div>
             <label>Event Description:</label>
             <input
               type="text"
               value={editEvent.eventDescription}
               onChange={(e) => setEditEvent({ ...editEvent, eventDescription: e.target.value })}
             />
           </div>
           <div>
             <label>Event Image:</label>
             <UploadInput
               type="file"
               accept="image/*"
               onChange={(e) => {
                 const file = e.target.files[0];
                 // Handle file upload logic here
               }}
             />
           </div>
           <div>
             <button type="button" onClick={handleSaveEdit}>Save</button>
           </div>
         </form>
       </div>
      )}
    </div>
  );
};

export default CreatedEvents;
