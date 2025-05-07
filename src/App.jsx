import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";

import AppLayout from "./layout/AppLayout";
import { BrowserRouter as Router } from "react-router-dom";
function App() {
    return (
        <div className="" style={{ padding: "0 30px" }}>
            <Router>
                <AppLayout></AppLayout>
            </Router>
        </div>
    );
}

export default App;
