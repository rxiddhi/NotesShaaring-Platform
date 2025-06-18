import React from 'react'
import Login from './Login'
import NotesBrowsingPage from './NotesBrowsingPage'
import NotesUploadPage from './components/NotesUploadPage'
import HomePage from './components/HomePage'
// import NoteCard from './NoteCard'
// import NotesGrid from '../NotesGrid'
// import NotesHeader from './NotesHeader'
// import NotesStats from './NotesStats'
// import SearchAndFilters
//  from './SearchAndFilters'

function App() {


  return (
    <>
    {/* <Login/> */}
    <NotesBrowsingPage/>
    <NotesUploadPage/>
    <HomePage />
    {/* <NoteCard/>
    <NotesGrid/>
    <NotesHeader/>
    <NotesStats/>
    <SearchAndFilters/> */}

      
    </>
  )
}

export default App
