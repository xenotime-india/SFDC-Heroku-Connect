import React from 'react';
import { Notification } from 'react-lightning-design-system';

export default props => {
  return (
    <Notification icon="ban" type="alert" level="error" onClose={props.onClose}>
      <strong>{props.errorMsg}</strong>
    </Notification>
  );
};
