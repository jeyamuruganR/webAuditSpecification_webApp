 #Web Audit Specification WebApp
This is a **full-stack web application** that audits websites for SEO, performance, accessibility, mobile responsiveness, security, and best practices.


It uses:
- **Backend**: Python (Playwright + BeautifulSoup)
- **Frontend**: React (Vite)
- **Report**: JSON audit + optional mobile screenshot
#This tool audits a given website for:
- SEO Health
- Performance
- Accessibility
- Security
- Mobile friendliness
- Best Practices

It generates a **detailed JSON report (`web_audit_result.json`)** and optionally captures a mobile screenshot (`mobile_view.png`).

------------------------------

-----How to Run------.
#Run Backend (Python)

   #Run via CLI:
   
     -python `web_audit.py` https://example.com
  
  #If no argument passed
  
    -python `web_audit.py`
#Run Frontend (React + Vite)

    -cd frontend
    -npm install
    -npm run dev



----Requirements---

Python 3.7+  
- Playwright (browser automation)  
- BeautifulSoup4 (HTML parsing)  
- requests (HTTP requests)  
- axe-core CLI (for accessibility)  
- Node.js (axe install)

React(vite)
  -axios
  -react-tabs


## Compilation 
 Clone or download the project

Install Python packages: 
pip install  -Playwright 
- BeautifulSoup4 
- requests 
- axe-core CLI


 Run playwright install

 Install axe-core CLI via npm

(Optional) Set up virtual environment (recommended)

Install react packages
  -npm install axios 

# --- Backend Design Overview ----.

 
 Main driver - `check_url(url)`
 
      - method calls each check sequentially and saves the output as a JSON file.

 SEO  Meta tag - `extract_meta_tags()`
 
     -Checks title, meta description, og:title, and canonical 

  Internal vs External Link - `check_link_ratio()`  
  
    - Counts internal and external links  
    
Broken Links- `find_broken_links()`   

    - Detects 404 or unreachable links 
    
Mobile View Screenshot `check_mobile_view()`   

    - Captures mobile screenshot using Playwright (iPhone 12)

Viewport Meta Tag -`check_viewport_meta()`        

    - Checks for mobile responsive viewport tag     

Performance Metrics -`check_performance_metrics()`   

    - Measures page load timings (FCP, DOM, Load event)  


  Render Blocking JS/CSS - `check_render_blocking()` 
  
     - Detects JS/CSS files that block rendering (no defer/async)

  
 Minified Assets -`check_minified_assets()` 
 
      -Lists JS/CSS files that are not minified      

  
 Lazy Loading -`check_lazy_loading()`   
 
     - Checks if images use `loading="lazy"`     


Accessibility (axe-core) - `run_axe_accessibility_audit()`  

    - Runs WAI-ARIA based accessibility audit using axe-core

Heading Structure- `check_heading_structure()`      

    - Analyzes usage of heading tags (h1 to h6)  

Indexability - `check_indexability()`         

    - Checks for presence of robots.txt and sitemap.xml

 Security Headers -`check_security_headers()`       
 
     - Checks security-related headers like CSP, X-Frame, etc.

Cookie Flags -`check_cookie_flags()`           

    - Checks if cookies use Secure and HttpOnly flags   

Mixed Content -`check_mixed_content()`  

    - Detects HTTP content (images/scripts) on HTTPS pages 

Redirect Chain  - `check_redirect_chain()` 

    - Detects number and list of redirects in a chain  


Large Images - `check_large_images()`        

    - Detects images larger than 300KB    

Content Analysis - `check_content_structure()`     

    - Analyzes word count and most frequent words    



 ## Backend Design Overview (Flask API)

|  Component                 |  Details                                                    |
| -------------------------- | ----------------------------------------------------------- |
| `Flask(__name__)`          | Initializes the Flask app                                   |
| `CORS(app)`                | Enables Cross-Origin support so React can send requests     |
| `@app.route('/api/audit')` | Defines the main POST API endpoint `/api/audit`             |
| `request.get_json()`       | Extracts JSON data (`url`) from the request sent by React   |
| `Web_audit()`              | Creates an object of the audit class to run all checks      |
| `check_url(url)`           | Main method that runs all audit functions and saves to JSON |
| `web_audit_result.json`    | JSON file where the audit results are stored temporarily    |
| `json.load(f)`             | Reads the stored result and prepares it for sending back    |
| `return jsonify(data)`     | Sends the audit report back to React as a JSON response     |


##Frontend Design Overview (React + Vite)

| Component / Function         | Description                                                                |
| ---------------------------- | -------------------------------------------------------------------------- |
| `useState()`                 | React hook to manage state for `url`, `result`, and `loading`              |
| `setUrl()`                   | Updates the URL state when user types in the input box                     |
| `setResult()`                | Stores the audit result or error message received from backend             |
| `setLoading()`               | Manages the loader display while waiting for audit result                  |
| `handleAudit()`              | Triggered on button click — sends POST request to `/api/audit`             |
| `axios.post()`               | Sends entered URL to backend (Flask or FastAPI), expects audit result JSON |
| `input[type="search"]`       | Text input for the user to enter a website URL                             |
| `button.onClick()`           | Runs `handleAudit()` to start the audit process                            |
| `disabled={loading}`         | Disables the button while audit is in progress                             |
| `loading ? ... : ...`        | Conditional rendering to show loader or result                             |
| `typeof result === 'string'` | If backend returns a string (error or message), display it as a `<p>`      |
| `Object.entries(result)`     | Dynamically loops over result object to display each section (e.g., SEO)   |
| `typeof value === 'object'`  | Checks if nested result (like SEO, Performance) is an object               |
| `JSON.stringify(v, null, 2)` | Formats deeply nested JSON for readability                                 |
| `<ul>`, `<li>`               | Lists each audit property inside each category (like key: value pairs)     |
| `<div className="loader">`   | Shows text-based loader during API call                                    |
| `<div className="result">`   | Displays audit output or helpful message if nothing is available           |
| `App.css`                    | Styles the header, input, button, results, loader, and responsiveness      |



##Data Flow

| Step | Action                                                             |
| ---- | ------------------------------------------------------------------ |
| 1️⃣  | User enters a URL in the search box                                |
| 2️⃣  | User clicks the **Audit** button                                   |
| 3️⃣  | `handleAudit()` sends the URL to `http://localhost:5000/api/audit` |
| 4️⃣  | Flask backend runs the audit and returns `web_audit_result.json`   |
| 5️⃣  | React receives and stores the result in `result` state             |
| 6️⃣  | React renders each section (SEO, Performance, etc.) as tabs        |
| 7️⃣  | When user clicks a tab, detailed JSON data is shown inside `<pre>` |



##Folder Structure Suggestion

frontend/
├── App.jsx
├── App.css

backend/
├── App.py
├── web_audit.py
