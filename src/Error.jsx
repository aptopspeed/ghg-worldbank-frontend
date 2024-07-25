import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';

const Error = () => {
  const location = useLocation();
  const { status, message } = location.state || { status: 404, message: "Page Not Found" };

  const getErrorMessage = () => {
    switch (status) {
      case 503:
        return "Service Unavailable. The server is temporarily unable to handle the request. Please try again later.";
      case 404:
        return "The page you are looking for doesn't exist or another error occurred.";
      default:
        return message || "An unexpected error occurred.";
    }
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h1" component="h1" gutterBottom>
        {status}
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        {status === 404 ? "Page Not Found" : "Error"}
      </Typography>
      <Typography variant="body1" paragraph>
        {getErrorMessage()}
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/">
        Go Back To Page
      </Button>
    </Container>
  );
};

export default Error;