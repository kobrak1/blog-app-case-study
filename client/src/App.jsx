import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/Homepage"
import Header from "./components/Header"

const App = () => {
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
