import { initializeApp } from 'firebase/app';
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; // Import CSS for react-tabs
import styled from 'styled-components';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA0pvc_FKN-c5qsY_Lb4tqVGDtK7pz3fbg",
  authDomain: "localeventure.firebaseapp.com",
  projectId: "localeventure",
  storageBucket: "localeventure.appspot.com",
  messagingSenderId: "952018081316",
  appId: "1:952018081316:web:d8898e7156da39fb682ab1",
  measurementId: "G-CDHGZRJMTL"
};
initializeApp(firebaseConfig);

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const FormContainer = styled.div`
  margin-top: 20px;
`;

const FormTitle = styled.h3`
  margin-bottom: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const AddCompanyUser = () => {
  const [companyName, setCompanyName] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'companies'));
      const companiesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCompanies(companiesData);
    };
    fetchCompanies();
  }, []);

  const handleAddCompany = async () => {
    try {
      const db = getFirestore();
      const docRef = await addDoc(collection(db, 'companies'), {
        companyName: companyName,
      });
      const companyId = docRef.id;
      console.log('Company added with ID: ', companyId);
      setCompanyName('');
    } catch (error) {
      console.error('Error adding company: ', error);
    }
  };

  const handleAddUser = async () => {
    try {
      const db = getFirestore();
      await addDoc(collection(db, 'users'), {
        companyId: selectedCompany,
        username: username,
        password: password,
      });
      console.log('User added successfully');
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Error adding user: ', error);
    }
  };

  return (
    <Container>
      <h2>Add Company & User</h2>
      <Tabs>
        <Tab label="Company">
          <FormContainer>
            <FormTitle>Add Company</FormTitle>
            <FormGroup>
              <Input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company Name"
              />
            </FormGroup>
            <Button onClick={handleAddCompany}>Save Company</Button>
          </FormContainer>
        </Tab>
        <Tab label="User">
          <FormContainer>
            <FormTitle>Add User</FormTitle>
            <FormGroup>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                <option value="">Select Company</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>{company.companyName}</option>
                ))}
              </select>
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </FormGroup>
            <Button onClick={handleAddUser}>Save User</Button>
          </FormContainer>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AddCompanyUser;
