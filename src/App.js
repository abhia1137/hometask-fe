import React, { useState, useEffect } from "react";
import { Container, Tabs, Tab, Box, Typography } from "@mui/material";
import axios from "axios";
import DataTable from "../src/Components/DataTable";

const tabsData = [
  {
    label: "Contracts",
    endpoint: "/contracts",
    method: "GET",
    message:
      "Please fix the API as it currently doesn't return the contract if it belongs to the caller's profile.",
  },
  {
    label: "Contract Details",
    endpoint: "/contracts/5",
    method: "GET",
    message:
      "This endpoint returns a list of contracts associated with a user (client or contractor), containing only non-terminated contracts.",
  },
  {
    label: "Unpaid Jobs",
    endpoint: "/jobs/unpaid",
    method: "GET",
    message:
      "Retrieve all unpaid jobs for a user, whether they're a client or a contractor.",
  },
  {
    label: "Best Profession",
    endpoint: "/admin/best-profession?start=2024-01-01&end=2025-01-01",
    method: "GET",
    message:
      "Find out the profession that earned the most money for any contractor within the given time range.",
  },
  {
    label: "Best Clients",
    endpoint: "/admin/best-clients?start=2024-01-01&end=2025-01-01",
    method: "GET",
    message:
      "Get the top clients who paid the most for jobs during the specified time period. The default limit is 2.",
  },
  {
    label: "Pay Job",
    endpoint: "/jobs/1/pay",
    method: "POST",
    body: { contractorId: 5 },
    message:
      "Process payment for a job. A client can only pay if their balance is sufficient. The paid amount will be transferred from the client's balance to the contractor's balance.",
    postbody: "Client ID:1, contractorId: 5",
  },
  {
    label: "Deposit Balance",
    endpoint: "/balances/deposit/1",
    method: "POST",
    body: { amount: 5 },
    message:
      "Deposit money into a client's balance. The deposited amount cannot exceed 25% of the total amount owed for jobs at the time of deposit.",
    postbody: "Client ID:1, amount: 5",
  },
];

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    {...other}
  >
    {value === index && (
      <Box p={3}>
        <Typography component="div">{children}</Typography>
      </Box>
    )}
  </div>
);

const App = () => {
  const [value, setValue] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchData = async (endpoint, method) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (method === "GET") {
        response = await axios.get(`http://localhost:3001${endpoint}`, {
          headers: { profile_id: 1 },
        });
      } else if (method === "POST") {
        response = await axios.post(
          `http://localhost:3001${endpoint}`,
          tabsData[value].body,
          {
            headers: { profile_id: 1 },
          }
        );
      }
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const endpoint = tabsData[value].endpoint;
    const method = tabsData[value].method;
    fetchData(endpoint, method);
  }, [value]);

  return (
    <Container>
      <Tabs value={value} onChange={handleChange} aria-label="API Tabs">
        {tabsData.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>
      {tabsData[value].message}
      {tabsData[value].body ? JSON.stringify(tabsData[value]?.body) : ""}
      {tabsData.map((tab, index) => (
        <TabPanel value={value} index={index} key={index}>
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography color="error">Error: {error}</Typography>}
          {data && (
            <Typography component="pre">
              <DataTable data={data} />
            </Typography>
          )}
        </TabPanel>
      ))}
    </Container>
  );
};

export default App;
