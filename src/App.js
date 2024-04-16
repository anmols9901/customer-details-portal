// App.js

import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      fetchImages();
      const interval = setInterval(fetchImages, 10000); // Refresh images every 10 seconds
      return () => clearInterval(interval); // Cleanup function to clear interval
    }
  }, [selectedCustomer]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('https://randomuser.me/api/?results=1000');
      const data = await response.json();
      setCustomers(data.results);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://dog.ceo/api/breeds/image/random/9');
      const data = await response.json();
      setImages(data.message);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
    setIsLoading(false);
  };

  const getAddress = (customer) => {
    const { street, city, state, postcode } = customer.location;
    return `${street.number} ${street.name}, ${city}, ${state}, ${postcode}`;
  };

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-4">
          <h2>Customers</h2>
          <div className="list-group">
            {customers.map((customer, index) => (
              <button
                key={index}
                type="button"
                className={`list-group-item list-group-item-action ${selectedCustomer === customer ? 'active' : ''}`}
                onClick={() => handleCustomerClick(customer)}
              >
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{customer.name.first} {customer.name.last}</h5>
                  <small>{customer.name.title}</small>
                </div>
                <p className="mb-1 small">{getAddress(customer)}</p>
              </button>
            ))}
          </div>
        </div>
        {selectedCustomer && (
          <div className="col-md-8">
            <h2>Customer Details</h2>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{selectedCustomer.name.first} {selectedCustomer.name.last}</h5>
                <p className="card-text">{getAddress(selectedCustomer)}</p>
              </div>
            </div>
            <div className="mt-4">
              <h2>Images</h2>
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <div className="row">
                  {images.map((image, index) => (
                    <div key={index} className="col-md-4 mb-3">
                      <img src={image} alt={`Dog ${index}`} className="img-fluid" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
