import React, { useRef, useState } from 'react';
import { addDoc, collection } from '@firebase/firestore';
import { firestore } from '../firebase';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { citiesInTurkey } from '../cities';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 2000px;
  margin: 0 auto;
  padding: 200px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #27055B; 
  color: #fff; 
`;

const Label = styled.label`
  margin-bottom: 16px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const DatePickerContainer = styled.div`
  margin-bottom: 16px;
`;

const TimePickerContainer = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const SuccessMessage = styled.div`
  margin-top: 16px;
  color: #4caf50; /* Green color for success message */
`;

const EventTypeSelect = styled(Select)`
  margin-bottom: 16px;
`;

const CreateEvent = () => {
  const dateRef = useRef();
  const hourRef = useRef();
  const minuteRef = useRef();
  const descRef = useRef();
  const cityRef = useRef();
  const districtRef = useRef();
  const nameRef = useRef();
  const eventTypeRef = useRef(); // Reference for event type dropdown

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const ref = collection(firestore, 'events');

  const handleSave = async (e) => {
    e.preventDefault();

    let data = {
      eventDate: selectedDate,
      eventTime: `${hourRef.current.value}:${minuteRef.current.value}`,
      eventDescription: descRef.current.value,
      eventLocation: `${selectedCity}, ${districtRef.current.value}`, // Combine city and district
      eventName: nameRef.current.value,
      eventType: eventTypeRef.current.value // Get the selected event type
    };

    try {
      // Use await to handle the promise
      await addDoc(ref, data);
      console.log('Document successfully written!');
      // Optionally, clear the form fields after successful submission
      setSelectedDate(null);
      hourRef.current.value = '';
      minuteRef.current.value = '';
      descRef.current.value = '';
      cityRef.current.value = '';
      districtRef.current.value = '';
      nameRef.current.value = '';
      eventTypeRef.current.value = ''; // Reset the event type dropdown
      setSuccessMessage('Event successfully saved!');
    } catch (error) {
      console.error('Error writing document: ', error);
      setSuccessMessage('Error saving event. Please try again.');
    }
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  return (
    <FormContainer onSubmit={handleSave}>
      <Label>Enter Event Name</Label>
      <Input type="text" ref={nameRef} required />
      <Label>Enter Event Date</Label>
      <DatePickerContainer>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          isClearable
          required
        />
      </DatePickerContainer>
      <Label>Enter Event Time</Label>
      <TimePickerContainer>
        <Input type="number" ref={hourRef} placeholder="Hour" min="0" max="23" required />
        <span>:</span>
        <Input type="number" ref={minuteRef} placeholder="Minute" min="0" max="59" required />
      </TimePickerContainer>
      <Label>Select City</Label>
      <Select ref={cityRef} onChange={handleCityChange} required>
        <option value="" disabled selected>
          Select a city
        </option>
        {citiesInTurkey.map((city) => (
          <option key={city.city} value={city.city}>
            {city.city}
          </option>
        ))}
      </Select>
      <Label>Select District</Label>
      <Select ref={districtRef} required>
        <option value="" disabled selected>
          Select a district
        </option>
        {selectedCity &&
          citiesInTurkey
            .find((city) => city.city === selectedCity)
            .districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
      </Select>
      <Label>Select Event Type</Label>
      <EventTypeSelect ref={eventTypeRef} required>
        <option value="" disabled selected>
          Select an event type
        </option>
        <option value="concert">Concert</option>
        <option value="theatre">Theatre</option>
        <option value="sport">Sport</option>
        <option value="dinner">Dinner</option>
        <option value="festival">Festival</option>
      </EventTypeSelect>
      <Label>Enter Event Description</Label>
      <Input type="text" ref={descRef} required />

      <Button type="submit">Save</Button>
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
    </FormContainer>
  );
};

export default CreateEvent;
