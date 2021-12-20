import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import User from './user/pages/User'
const App = () => {
  return (
    <Router>
    <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    <Routes>   
      <Route path="/" element={<User/>} />
      <Route path="/about" element={<h1>About page</h1>} />
    </Routes>
    </Router>
  )
}

export default App
