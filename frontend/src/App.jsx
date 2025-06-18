import React from 'react'
import Login from './Login'
import SignUp from './components/SignUp';


import NotesBrowsingPage from './NotesBrowsingPage'
import NotesUploadPage from './components/NotesUploadPage'
// import NoteCard from './NoteCard'
// import NotesGrid from '../NotesGrid'
// import NotesHeader from './NotesHeader'
// import NotesStats from './NotesStats'
// import SearchAndFilters
//  from './SearchAndFilters'

function App() {


  return (
    <>
    <Login/>
    <NotesBrowsingPage/>
    <NotesUploadPage/>
    <SignUp />

    {/* <NoteCard/>
    <NotesGrid/>
    <NotesHeader/>
    <NotesStats/>
    <SearchAndFilters/> */}

      
    </>
  )
}

export default App
