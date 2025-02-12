import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import "./App.css";

// GraphQL Client
const client = new ApolloClient({
  uri: "https://travel-booking-xx2t.vercel.app/",
  cache: new InMemoryCache(),
});

// GraphQL Mutation
const BOOK_TICKET = gql`
  mutation BookTicket(
    $name: String!
    $email: String!
    $phone: String!
    $currentLocation: String!
    $travelDate: String!
    $destination: String!
  ) {
    bookTicket(
      name: $name
      email: $email
      phone: $phone
      currentLocation: $currentLocation
      travelDate: $travelDate
      destination: $destination
    ) {
      id
      name
    }
  }
`;

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentLocation: "",
    travelDate: "",
    destination: "",
  });

  const [bookTicket, { loading, error }] = useMutation(BOOK_TICKET);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bookTicket({ variables: { ...formData } });
      alert("🎉 Ticket booked successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        currentLocation: "",
        travelDate: "",
        destination: "",
      });
    } catch (err) {
      alert("❌ Booking failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h2>Book Your Travel Ticket</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="currentLocation"
            placeholder="Your Current Location"
            value={formData.currentLocation}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="travelDate"
            value={formData.travelDate}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={formData.destination}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Booking..." : "Book Now"}
          </button>
          {error && <p className="error">❌ {error.message}</p>}
        </form>
      </div>
    </div>
  );
};

const App = () => (
  <ApolloProvider client={client}>
    <BookingForm />
  </ApolloProvider>
);

export default App;
