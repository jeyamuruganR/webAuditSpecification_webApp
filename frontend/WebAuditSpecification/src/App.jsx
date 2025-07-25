import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAudit = async () => {
    setLoading(true);
    setResult(null); 
    try {
      const response = await axios.post('http://localhost:5000/api/audit', { url });
      setResult(response.data);
    } catch (err) {
      setResult("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="head">
        <h1>Web Audit Tool</h1>
      </div>

      <div className="searchBox">
        <div className="icon"></div>
        <div className="box">
          <input
            type="search"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter the URL..."
          />
        </div>
        <div className="button">
          <button onClick={handleAudit} disabled={loading}>
            {loading ? 'Auditing...' : 'Audit to get started'}
          </button>
        </div>
      </div>

      <div className="result">
        {loading ? (
          <div className="loader"><p>Please wait...</p>
                <FontAwesomeIcon icon={faSpinner} spin size="1.5x" />
              </div>
        ) : result ? (
          <div className="result-container">
            {typeof result === 'string' ? (
              <p>{result}</p>
            ) : (
              Object.entries(result).map(([key, value], index) => (
                <div key={index} className="result-item">
                  <h3>{key}</h3>
                  {typeof value === 'object' && value !== null ? (
                    <ul>
                      {Object.entries(value).map(([k, v], i) => (
                        <li key={i}>
                          <strong>{k}:</strong>{" "}
                          {typeof v === "object" ? JSON.stringify(v, null, 2) : v?.toString()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{value?.toString()}</p>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <p>Enter a URL and click Audit to get started.</p>
        )}
      </div>
  
    </section>
  );
}

export default App;
