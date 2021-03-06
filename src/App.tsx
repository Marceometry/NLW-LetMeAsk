import { BrowserRouter, Route, Switch } from "react-router-dom"
import { AuthContextProvider } from "./contexts/AuthContext"
import { ThemeContextProvider } from "./contexts/ThemeContext"
import { AdminRoom } from "./pages/AdminRoom"

import { Home } from "./pages/Home"
import { NewRoom } from "./pages/NewRoom"
import { Room } from "./pages/Room"

export default function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <ThemeContextProvider>
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/rooms/new" component={NewRoom} />
            <Route path="/rooms/:id" component={Room} />
            <Route path="/admin/rooms/:id" component={AdminRoom} />
          </Switch>
        </ThemeContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  )
}