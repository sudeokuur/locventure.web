import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

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
          responses: {
            yes: event.responses && event.responses['yes'] ? event.responses['yes'].length : 0,
            maybe: event.responses && event.responses['maybe'] ? event.responses['maybe'].length : 0,
            no: event.responses && event.responses['no'] ? event.responses['no'].length : 0,
          },
        }));
        setEventStats(stats);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Event Statistics</h2>
      <table>
        <thead>
        <tr style={{ fontSize: '1.2rem' }}>
  <th style={{ padding: '10px' }}>Event Name</th>
  <th style={{ padding: '10px' }}>Yes</th>
  <th style={{ padding: '10px' }}>Maybe</th>
  <th style={{ padding: '10px' }}>No</th>
</tr>
        </thead>
        <tbody>
          {eventStats.map((event, index) => (
            <tr key={index}>
              <td>{event.eventName}</td>
              <td>{event.responses.yes}</td>
              <td>{event.responses.maybe}</td>
              <td>{event.responses.no}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Statistics;
