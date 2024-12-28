import './styles/ads.css'
import Ad from './Ad'

const AdsSideBar = () => {
  return (
    <div className='pt-3'>
        <div className='d-flex flex-column justify-content-center align-items-center gap-2 overflow-y-hidden' >
            <Ad param="Ad1" />
            <Ad param="Ad2" />
            <Ad param="Ad2" />
            <Ad param="Ad2" />
            <Ad param="Ad2" />
            <Ad param="Ad2" />
        </div>
    </div>
  )
}

export default AdsSideBar