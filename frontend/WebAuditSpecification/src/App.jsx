import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);

  const handleAudit = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/audit', { url });
            setResult(response.data);
        } catch (err) {
            setResult("Error: " + err.message);
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
          <button onClick={handleAudit}>Audit to get started</button>
        </div>
      </div>

      <div className="result">
          {result ? (
                <Tabs>
                    <TabList>
                        {Object.keys(result).map((section, index) => (
                            <Tab key={index}>{section}</Tab>
                        ))}
                       
                    </TabList>

                    {Object.entries(result).map(([section, data], index) => (
                        <TabPanel key={index}>
                          <h3>{section}</h3>

                          {section.toLowerCase() === "mobile view" && typeof data === "string" && data.includes("mobile_view.png") ? (
                            <div>
                              <p>{data}</p>

                              <img
                                src="backend\mobile_view.png"
                                alt="Mobile Screenshot"
                                style={{ maxWidth: '100%', border: '1px solid #ccc', marginTop: '10px' }}
                              />
                            </div>
                          ) : (
                            <pre style={{ background: '#f4f4f4', padding: '10px' }}>
                              {typeof data === 'object' ? JSON.stringify(data, null, 2) : data}
                            </pre>
                          )}
                        </TabPanel>
                    ))}



                </Tabs>
            ) : (
                <p>Enter a URL and click Audit to get started.</p>
            )}
      </div>
    </section>
  );
}

export default App;
