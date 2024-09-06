import React  from 'react';
import Notification from '../parts/Notification';

export default function NotificationSide() {
  return (
    <div className="p-0">
      <div className="ps-2">
          <div 
            className="p-4 notification-side primary-scrollbar" 
            style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }} 
          >
            <Notification type='like'/>
            <Notification type='comment'/>
            <Notification type='like'/>
            <Notification type='dislike'/>
            <Notification type='like'/>
            <Notification type='intrested'/>
            <Notification type='like'/>
            <Notification type='like'/>
            <Notification type='share'/>
            <Notification type='intrested'/>
          </div>
      </div>
    </div>
  );
}








