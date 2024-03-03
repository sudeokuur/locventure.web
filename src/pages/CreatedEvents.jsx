// CreatedEvents.jsx
import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
} from '@firebase/firestore';
import { firestore } from '../firebase';

const CreatedEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editableEvent, setEditableEvent] = useState(null);
// test test test test
  const loadEvents = async () => {
    const eventsCollection = collection(firestore, 'events');
    let eventsQuery = query(eventsCollection);

    // Apply search filter if searchTerm is present
    if (searchTerm) {
      eventsQuery = query(
        eventsCollection,
        where('eventName', '>=', searchTerm),
        orderBy('eventName')
      );
    }

    const snapshot = await getDocs(eventsQuery);
    const eventsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setEvents(eventsData);
  };

  useEffect(() => {
    // Initial load without search term
    loadEvents();
  }, []); // Empty dependency array for initial load

  const handleSearch = () => {
    // Trigger a re-fetch of events based on the new search term
    loadEvents();
  };

  const handleEdit = (event) => {
    setEditableEvent(event);
  };

  const handleSave = async () => {
    if (editableEvent) {
      // Update the event in the Firestore database
      const eventRef = doc(firestore, 'events', editableEvent.id);
      await updateDoc(eventRef, {
        eventName: editableEvent.eventName,
        eventDate: editableEvent.eventDate,
        eventLocation: editableEvent.eventLocation,
        eventDescription: editableEvent.eventDescription,
      });

      // Reset editableEvent state and reload events
      setEditableEvent(null);
      loadEvents();
      //test2 for new pc 
    }
  };

  const handleInputChange = (fieldName, value) => {
    // Update the corresponding field in editableEvent
    setEditableEvent((prevEditableEvent) => ({
      ...prevEditableEvent,
      [fieldName]: value,
    }));
  };

  const formatDate = (timestamp) => {
    if (timestamp && timestamp.toDate instanceof Function) {
      const dateObject = timestamp.toDate();
      return dateObject.toLocaleString();
    } else {
      return 'Invalid Date';
    }
  };

  return (
    <div>
      <h1>Created Events</h1>

      {/* Search input and button */}
      <div>
        <input
          type="text"
          placeholder="Search by event name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {editableEvent === event ? (
              // Edit mode
              <div>
                <label>Title:</label>
                <input
                  type="text"
                  value={editableEvent.eventName}
                  onChange={(e) => handleInputChange('eventName', e.target.value)}
                />

                <label>Date:</label>
                <input
                  type="text" // Update to the appropriate input type for date
                  value={formatDate(editableEvent.eventDate)}
                  onChange={(e) => handleInputChange('eventDate', e.target.value)}
                />

                <label>Location:</label>
                <input
                  type="text"
                  value={editableEvent.eventLocation}
                  onChange={(e) => handleInputChange('eventLocation', e.target.value)}
                />

                <label>Description:</label>
                <textarea
                  value={editableEvent.eventDescription}
                  onChange={(e) =>
                    handleInputChange('eventDescription', e.target.value)
                  }
                ></textarea>

                <button onClick={handleSave}>Save</button>
              </div>
            ) : (
              // View mode
              <div>
                <strong>{event.eventName}</strong>
                <p>Date: {formatDate(event.eventDate)}</p>
                <p>Location: {event.eventLocation}</p>
                <p>Description: {event.eventDescription}</p>
                <button onClick={() => handleEdit(event)}>Edit</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreatedEvents;
