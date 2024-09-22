import React from 'react';
import { Alert } from 'react-bootstrap';

const Message = ({ variant = 'info', children }) => {
  return (
    <Alert variant={variant}>
      <span>{children}</span> {/* Wrapping children in a span to avoid nested <p> tags */}
    </Alert>
  );
};

export default Message;
