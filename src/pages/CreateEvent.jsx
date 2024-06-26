import { addDoc, collection } from '@firebase/firestore';
import React, { useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import { citiesInTurkey } from '../cities';
import { firestore } from '../firebase';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.8); /* Arka plan transparan */
  color: #000000; /* Yazı rengi siyah */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const PageTitle = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 3rem;
  font-family: 'Roboto', sans-serif;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: ${props => props.width || '100%'}; /* Eğer belirtilmezse varsayılan genişlik */
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
  align-items: center;
`;

const TimeInput = styled(Input)`
  width: 48%;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #27055B; /* Lacivert */
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #1e0446;
  }
`;

const SuccessMessage = styled.div`
  margin-top: 16px;
  color: #4caf50; /* Yeşil renk */
`;

const ErrorMessage = styled.div`
  margin-top: 16px;
  color: #f44336; /* Kırmızı renk */
`;

const EventTypeSelect = styled(Select)`
  margin-bottom: 16px;
`;

const CreateEvent = () => {
  const [image, setImage] = useState(null);
  const imageInputRef = useRef(null);
  const hourRef = useRef();
  const minuteRef = useRef();
  const descRef = useRef();
  const cityRef = useRef();
  const districtRef = useRef();
  const nameRef = useRef();
  const eventTypeRef = useRef();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const eventRef = collection(firestore, 'events');

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      !nameRef.current.value ||
      !selectedDate ||
      !hourRef.current.value ||
      !minuteRef.current.value ||
      !selectedCity ||
      !districtRef.current.value ||
      !eventTypeRef.current.value ||
      !descRef.current.value ||
      !image
    ) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }
    try {
      const eventData = {
        eventDate: selectedDate,
        eventTime: `${hourRef.current.value}:${minuteRef.current.value}`,
        eventDescription: descRef.current.value,
        eventCity: selectedCity, // Add eventCity field
        eventDistrict: districtRef.current.value,
        eventName: nameRef.current.value,
        eventType: eventTypeRef.current.value,
        eventImage: image ? await convertImageToBase64(image) : null
      };

      const docRef = await addDoc(eventRef, eventData);

      console.log('Document written with ID: ', docRef.id);
      setSuccessMessage('Event successfully saved!');
      setSelectedDate(null);
      hourRef.current.value = '';
      minuteRef.current.value = '';
      descRef.current.value = '';
      cityRef.current.value = '';
      districtRef.current.value = '';
      nameRef.current.value = '';
      eventTypeRef.current.value = '';
      imageInputRef.current.value = '';
      setErrorMessage('');
    } catch (error) {
      console.error('Error adding document: ', error);
      setErrorMessage('Error saving event. Please try again.');
      setSuccessMessage('');
    }
  };

  const convertImageToBase64 = (imageFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  return (
    <div>
      <PageTitle>Create Event</PageTitle>
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
          <TimeInput type="number" ref={hourRef} placeholder="Hour" min="0" max="23" required />
          <span>:</span>
          <TimeInput type="number" ref={minuteRef} placeholder="Minute" min="0" max="59" required />
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
          <option value="Party">Party</option>
          <option value="Concert">Concert</option>
          <option value="Theater">Theatre</option>
          <option value="Camping">Camping</option>
          <option value="FamilyFriendly">Family Friendly</option>
          <option value="Sport">Sport</option>
          <option value="Festival">Festival</option>
          <option value="Outdoor">Outdoor</option>
        </EventTypeSelect>
        <Label>Enter Event Description</Label>
        <Input type="text" ref={descRef} required width="100%" />

        <Label>Upload Event Image</Label>
        <Input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} />

        <Button type="submit">Save</Button>
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </FormContainer>
    </div>
  );
};

export default CreateEvent;
