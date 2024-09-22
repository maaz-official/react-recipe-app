import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './checkout.css';

function CheckoutSteps({ step1, step2, step3, step4 }) {
  return (
    <Nav className="justify-content-center mb-4">
      <Nav.Item>
        {step1 ? (
          <LinkContainer to="/login">
            <Nav.Link className="step-active">Sign In</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className="step-disabled">Sign In</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <LinkContainer to="/shipping">
            <Nav.Link className="step-active">Shipping</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className="step-disabled">Shipping</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <LinkContainer to="/payment">
            <Nav.Link className="step-active">Payment</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className="step-disabled">Payment</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step4 ? (
          <LinkContainer to="/placeorder">
            <Nav.Link className="step-active">Place Order</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className="step-disabled">Place Order</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
}

export default CheckoutSteps;
