import React from 'react';
import Notification from '../parts/Notification';

export default function NotificationSide() {
  return (
    <div className="col-lg-3 p-0 d-none d-lg-block">
      <div className="ps-2">
        <div className="bg-light shadow-lg">
          <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
            <h2 className="h2 fw-bold mb-0 text-center">Notifications</h2>
          </div>
          <div 
            className="p-4 notification-side" 
            style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }} 
          >
            <Notification type='like'/>
            <Notification type='comment'/>
            <Notification type='like'/>
            <Notification type='dislike'/>
            <Notification type='intrested'/>
            <Notification type='like'/>
            <Notification type='like'/>
          </div>
        </div>
      </div>
    </div>
  );
}








