'use client';
import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, Typography, TextField, Button, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Snackbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert from '@mui/material/Alert';
import { useForm } from 'react-hook-form';

// Reusable Alert component for Snackbar
const Alert = React.forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formMode, setFormMode] = useState('create'); // create or update
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar visibility
  const { register, handleSubmit, reset } = useForm();

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer`);
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]); // Add fetchCustomers to the dependency array
  

  // Handle delete customer
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Customer deleted successfully');
        fetchCustomers(); // Refresh list
        setOpenSnackbar(true);
      } else {
        setMessage('Failed to delete customer');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setMessage('Error deleting customer');
      setOpenSnackbar(true);
      console.error(error);
    }
  };

  // Handle customer form submission (for both create and update)
  const handleFormSubmit = async (data) => {
    const url = formMode === 'create' ? `${process.env.NEXT_PUBLIC_API_URL}/customer` : `${process.env.NEXT_PUBLIC_API_URL}/customer/${selectedCustomer.id}`;
    const method = formMode === 'create' ? 'POST' : 'PUT';

    // Logging the data being sent and the URL
    console.log('Submitting data:', data);
    console.log('API URL:', url);

    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Parse and log the response
        const responseData = await response.json();
        console.log('Response:', responseData);

        if (response.ok) {
            setMessage(`Customer ${formMode === 'create' ? 'created' : 'updated'} successfully`);
            fetchCustomers(); // Refresh the customer list
            reset(); // Reset form fields
            setSelectedCustomer(null); // Reset selected customer
            setFormMode('create'); // Switch back to create mode
            setOpenSnackbar(true);
        } else {
            setMessage(`Failed to ${formMode === 'create' ? 'create' : 'update'} customer: ${responseData.message || 'Unknown error'}`);
            setOpenSnackbar(true);
        }
    } catch (error) {
        // Improved error logging
        console.error('Error submitting customer form:', error);
        setMessage('Error submitting customer form');
        setOpenSnackbar(true);
    }
  };

  // Handle edit customer (populate form with selected customer data)
  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setFormMode('update');
    reset(customer); // Populate the form with customer data
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Customer Management
      </Typography>

      {/* Customer List */}
      <Card variant="outlined" sx={{ padding: 2, marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Customer List
        </Typography>
        {customers.length > 0 ? (
          <List>
            {customers.map((customer) => (
              <ListItem key={customer.id}>
                <ListItemText
                  primary={customer.name}
                  secondary={`Interest: ${customer.interest}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleEdit(customer)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(customer.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No customers found</Typography>
        )}
      </Card>

      {/* Customer Form (create or update) */}
      <CustomerForm
        onSubmit={handleSubmit(handleFormSubmit)}
        register={register}
        formMode={formMode}
      />

      {/* Display Snackbar for success or error message */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

// Reusable customer form component
function CustomerForm({ onSubmit, register, formMode }) {
  return (
    <Card variant="outlined" sx={{ padding: 2, marginBottom: 4 }}>
      <Typography variant="h6" gutterBottom>
        {formMode === 'create' ? 'Create New Customer' : 'Update Customer'}
      </Typography>
      <form onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Name"
              {...register("name", { required: true })}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Date"
              type="date"
              {...register("date")}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Member"
              type="number"
              {...register("member", { required: true })}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Interest"
              {...register("interest", { required: true })}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {formMode === 'create' ? 'Create Customer' : 'Update Customer'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Card>
  );
}
