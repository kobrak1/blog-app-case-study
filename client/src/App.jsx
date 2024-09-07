import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/Homepage"
import Header from "./components/Header/Header"

const App = () => {
  console.log('App.jsx has been rendered')
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
