import { React, useRef } from 'react';
import { addDoc, collection } from '@firebase/firestore';
import { firestore } from '../firebase';

export default function Home() {
  const dateRef = useRef();
  const descRef = useRef();
  const locRef = useRef();
  const nameRef = useRef();

  const ref = collection(firestore, 'events');

  const handleSave = async (e) => {
    e.preventDefault();

    let data = {
      eventDate: dateRef.current.value,
      eventDescription: descRef.current.value,
      eventLocation: locRef.current.value,
      eventName: nameRef.current.value,
    };

    try {
      // Use await to handle the promise
      await addDoc(ref, data);
      console.log('Document successfully written!');
    } catch (error) {
      console.error('Error writing document: ', error);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <label>Enter Event Name</label>
      <input type="text" ref={nameRef} />
      <label>Enter Event Date</label>
      <input type="text" ref={dateRef} />
      <label>Enter Event Location</label>
      <input type="text" ref={locRef} />
      <label>Enter Event Description</label>
      <input type="text" ref={descRef} />

      <button type="submit">Save</button>
    </form>
  );
}
