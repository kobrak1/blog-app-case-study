import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/Homepage"
import Header from "./components/Header/Header"
import { decodeToken } from '@leteu/jwt-decoder'

const App = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbnNhckBnbWFpbC5jb20iLCJpZCI6IjY2N2YxYTQwYjM0OGYyZDkyNGQ0NWIxNiIsImlhdCI6MTcyMDcyMDI5NSwiZXhwIjoxNzIwNzIzODk1fQ.AQes3OV8S_ll_IHanPZ1mfxQ6dzLaDHfD1br0QeZob8'
  console.log(decodeToken(token))
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blogs" />
      </Routes>
    </div>
  )
}

export default App
