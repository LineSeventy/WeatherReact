import React from 'react'
import { Route, Routes } from "react-router-dom";
import MainPage from '../Components/MainPage';

import ErrorPage from '../Components/ErrorPage';


function RoutesLayout() {
  return (
<><Routes>
    <Route path='/' element={<MainPage/>} />

    <Route path='*' element={<ErrorPage/>}/>
</Routes>
</>
  )
}

export default RoutesLayout