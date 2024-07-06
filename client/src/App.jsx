import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/Homepage"
import Header from "./components/Header/Header"

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  )
}

export default App
