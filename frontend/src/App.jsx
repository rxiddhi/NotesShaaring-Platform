import React from 'react'
import Login from './Login'
import SignUp from './components/SignUp';
import HomePage from './components/HomePage';
import NotesBrowsingPage from './NotesBrowsingPage'
import NotesUploadPage from './components/NotesUploadPage'
function App() {


  return (
    <>
    <Login/>
    <HomePage/>
    <NotesBrowsingPage/>
    <NotesUploadPage/>
    <SignUp />    
    </>
  )
}
export default App
