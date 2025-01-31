import React , {useContext}from 'react'
import '../css/SettingsPage.css'
import userContext from "../components/contexts/userContext";


function SettingsPage() {
  const {user}= useContext(userContext) ;
  const userId=user.id ;
  return (
    <div>SettingsPage</div>
  )
}

export default SettingsPage