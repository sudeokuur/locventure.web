import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
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

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.8); /* Transparan arka plan */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const PageTitle = styled.h2`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 2.5rem;
  font-family: 'Roboto', sans-serif;
`;

const FormContainer = styled.div`
  margin-top: 20px;
`;

const FormTitle = styled.h3`
  margin-bottom: 10px;
  color: #2c3e50;
  font-size: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #2c3e50; /* Düğme arka plan rengi */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #1a252f;
  }
`;

const Message = styled.p`
  margin-top: 10px;
  color: ${({ success }) => (success ? 'green' : 'red')};
`;

const AddCompanyUser = () => {
  const [companyName, setCompanyName] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companies, setCompanies] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'companies'));
        const companiesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching companies: ', error);
      }
    };
    fetchCompanies();
  }, []);

  const handleAddCompany = async () => {
    try {
      await addDoc(collection(db, 'companies'), {
        companyName: companyName,
      });
      setCompanyName('');
      setMessage('Company added successfully');
    } catch (error) {
      console.error('Error adding company: ', error);
      setMessage(`Error adding company: ${error.message}`);
    }
  };

  const handleAddUser = async () => {
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords don't match");
      }

      // Create user in Firebase Authentication
      await createUserWithEmailAndPassword(auth, username, password);

      // Add user to Firestore
      await addDoc(collection(db, 'users'), {
        companyId: selectedCompany,
        email: username,
        // You can choose not to store the password here for security reasons
      });

      setMessage('User added successfully');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      navigate('/login'); // Redirect to the login page after successful registration
    } catch (error) {
      setMessage(`Error adding user: ${error.message}`);
    }
  };

  return (
    <Container>
      <PageTitle>Add Company & User</PageTitle>
      <Tabs>
        <TabList>
          <Tab>Company</Tab>
          <Tab>User</Tab>
        </TabList>

        <TabPanel>
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
        </TabPanel>

        <TabPanel>
          <FormContainer>
            <FormTitle>Add User</FormTitle>
            <FormGroup>
              <Select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                <option value="">Select Company</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>{company.companyName}</option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Email"
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
            <FormGroup>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
              />
            </FormGroup>
            <Button onClick={handleAddUser}>Save User</Button>
            {message && <Message success={message.includes('successfully')}>{message}</Message>}
          </FormContainer>
        </TabPanel>
      </Tabs>
    </Container>
  );
};

export default AddCompanyUser;
