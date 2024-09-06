import React , {useState , useEffect} from 'react';
import { IconButton, Drawer } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import NotificationSide from './NotificationSide';



export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  //open/close func
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(open);
  };


  // alt n event
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key.toLowerCase() === 'n') {
        setOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);



  return (
    <>
    <IconButton
        variant="contained"
        onClick={toggleDrawer(true)}
        aria-label="Toggle notifications"
        className="position-fixed bottom-0 end-0 m-4"
        style={{ zIndex: 1050, backgroundColor: '#f8f9fa' }} 
      >
        <NotificationsIcon fontSize="large" className='text-primary'/>
      </IconButton>

      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <div className="d-flex flex-column h-100 p-3" style={{ width: '400px' }}>
          <div className="d-flex justify-content-between align-items-center border-bottom pb-3">
            <h2 className='fw-bold'>Notifications</h2>
            <IconButton onClick={toggleDrawer(false)} aria-label="Close">
              <CloseIcon className='text-black fs-2'/>
            </IconButton>
          </div>

          <div className="flex-grow-1 overflow-auto mt-3">
                <NotificationSide/>
          </div>
        </div>
      </Drawer>
    </>
  );
}
