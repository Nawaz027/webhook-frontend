// src/DataFetcher.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DataFetcher.css';  // Import the external CSS file

const DataFetcher = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      timeZone: 'UTC' 
    }) + ' UTC';
  };

  const formatData = (data) => {
    return data.map((item) => {
      const { action, author, from_branch, to_branch, timestamp } = item;
      const formattedTimestamp = formatDate(timestamp);

      switch (action) {
        case 'PUSH':
          return `${author} pushed to "${to_branch}" on ${formattedTimestamp}`;
        case 'PULL_REQUEST':
          return `${author} submitted a pull request from "${from_branch}" to "${to_branch}" on ${formattedTimestamp}`;
        case 'MERGE':
          return `${author} merged branch "${from_branch}" to "${to_branch}" on ${formattedTimestamp}`;
        default:
          return `Unknown action ${action}`;
      }
    });
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/webhook/data');
      console.log('Data fetched:', response.data);
      setData(formatData(response.data)); // Format data before setting it
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data.');
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, 15000); // Polling every 15 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  return (
    <div className="data-fetcher-container">
      <h1 className="header">Data from MongoDB</h1>
      {error && <p className="error-message">{error}</p>}
      <ul className="data-list">
        {data.length > 0 ? (
          data.map((item, index) => (
            <li key={index} className="data-item">
              {item}
            </li>
          ))
        ) : (
          <p className="no-data">No data available</p>
        )}
      </ul>
    </div>
  );
};

export default DataFetcher;
