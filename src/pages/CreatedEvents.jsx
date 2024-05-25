import { collection, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { firestore } from '../firebase';

// Styled Components
const Container = styled.div`
  background-image: url('/mnt/data/ialperen_resim.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TableContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 1200px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
  font-family: 'Roboto', sans-serif;
`;

const StyledThead = styled.thead`
  background-color: #2c3e50;
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
  ${({ transparent }) => transparent && 'background-color: transparent;'}
  ${({ status }) => status === 'CURRENT' && `
    background-color: #d4edda;
    color: #155724;
  `}
  ${({ status }) => status === 'PAST' && `
    background-color: #f8d7da;
    color: #721c24;
  `}
`;

const TableRow = styled.tr``;

const PageTitle = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 3rem;
  font-family: 'Roboto', sans-serif;
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
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background-color: #1a252f;
  }
`;

const EditButton = styled.button`
  background-color: #2c3e50;
  color: #fff;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;

  &:hover {
    background-color: #1a252f;
  }
`;

const UploadInput = styled.input`
  margin-top: 10px;
`;

const EditFormContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  margin-top: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const CreatedEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editEvent, setEditEvent] = useState(null);

  const loadEvents = async (searchTerm = '') => {
    const eventsCollection = collection(firestore, 'events');
    let eventsQuery = query(eventsCollection);

    if (searchTerm) {
      eventsQuery = query(eventsCollection, where('eventName', '>=', searchTerm), where('eventName', '<=', searchTerm + '\uf8ff'), orderBy('eventName'));
    }

    const snapshot = await getDocs(eventsQuery);
    const eventsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setEvents(eventsData);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSearch = () => {
    loadEvents(searchTerm);
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
        eventLocation: editEvent.eventLocation || '', // undefined ise boş string yap
        eventCity: editEvent.eventCity || '', // undefined ise boş string yap
        eventType: editEvent.eventType,
        eventDate: editEvent.eventDate,
        eventDescription: editEvent.eventDescription || '', // undefined ise boş string yap
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
      const formattedDate = dateObject.toLocaleDateString();
      return formattedDate;
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
    <Container>
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

      <TableContainer>
        <StyledTable>
          <StyledThead>
            <TableRow>
              <StyledTh>Event Name</StyledTh>
              <StyledTh>City</StyledTh> {/* Changed "Address" to "City" */}
              <StyledTh>Type</StyledTh>
              <StyledTh>Date</StyledTh>
              <StyledTh>Status</StyledTh>
              <StyledTh>Edit Event</StyledTh>
            </TableRow>
          </StyledThead>
          <tbody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <StyledTd>{event.eventName}</StyledTd>
                <StyledTd transparent>{event.eventCity}</StyledTd> {/* Changed to eventCity */}
                <StyledTd>{event.eventType}</StyledTd>
                <StyledTd>{formatDate(event.eventDate)}</StyledTd>
                <StyledTd status={getStatus(event.eventDate)}>
                  {getStatus(event.eventDate)}
                </StyledTd>
                <StyledTd>
                  <EditButton onClick={() => handleEdit(event.id)}>Edit</EditButton>
                </StyledTd>
              </TableRow>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>

      {editEvent && (
        <EditFormContainer>
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
                value={new Date(editEvent.eventDate.toDate()).toISOString().substr(0, 10)}
                onChange={(e) => setEditEvent({ ...editEvent, eventDate: new Date(e.target.value) })}
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
              <label>Event Location:</label>
              <input
                type="text"
                value={editEvent.eventLocation || ''}
                onChange={(e) => setEditEvent({ ...editEvent, eventLocation: e.target.value })}
              />
            </div>
            <div>
              <label>Event City:</label> {/* Added eventCity field */}
              <input
                type="text"
                value={editEvent.eventCity || ''}
                onChange={(e) => setEditEvent({ ...editEvent, eventCity: e.target.value })}
              />
            </div>
            <div>
              <label>Event Description:</label>
              <input
                type="text"
                value={editEvent.eventDescription || ''}
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
        </EditFormContainer>
      )}
    </Container>
  );
};

export default CreatedEvents;
