import React from 'react';
import { Notification } from 'react-lightning-design-system';

export default props => {
  return (
    <Notification
      icon="check"
      type="alert"
      level="success"
      onClose={props.onClose}
    >
      <strong>{props.message}</strong>
    </Notification>
  );
};
