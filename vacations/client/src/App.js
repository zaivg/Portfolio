import React, { useReducer } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import './App.css';
import { Container, Row, Col } from './modules/Decoration';
import AlertMessage from './components/modals/AlertMessage';
import Header from './components/Header';
import Signin from './components/Signin';
import Login from './components/Login';
import VacationList from './components/VacationList';
import VacationItemAddUpd from './components/modals/VacationItemAddUpd';
import Report from './components/Report';
import NotFound from './components/NotFound';

import { alertReducer, initialStateAlert } from './redusers/alertReducer';
import { userReducer, initialStateUser } from './redusers/userReducer';

export const AlertContext = React.createContext();
export const UserContext = React.createContext();


function App() {
  const [alertState, alertDispatch] = useReducer(alertReducer, initialStateAlert);
  const [userState, userDispatch] = useReducer(userReducer, initialStateUser);


  return (
    <AlertContext.Provider value={{ alertState: alertState, alertDispatch: alertDispatch }}>
      <UserContext.Provider value={{ userState: userState, userDispatch: userDispatch }}>
        <Router>
          <div className="App">

            <AlertMessage />

            { userState.id === (-1)
                ? (<Redirect to="/login" />)
                : null
            }

            <header>
              <Header />
            </header>

            <main>
              <Switch>
                <Route path="/signin" component={Signin} />
                <Route path="/login" component={Login} />

                <Route path="/vacation/list" component={VacationList} />
                <Route path="/vacation/add" component={VacationItemAddUpd} />
                <Route path="/vacation/update/:id(\d+)" component={VacationItemAddUpd} />

                <Route path="/report" component={Report} />

                <Redirect exact from="/" to="/vacation/list" />
                <Route path="*" component={NotFound} />
              </Switch>
            </main>
            
          </div> {/* .App */}
        </Router>
      </UserContext.Provider>
    </AlertContext.Provider>
  );//return
}//App()


export default App;
