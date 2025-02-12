require("dotenv").config();
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const corsOptions = {
  origin: "https://travel-booking-eta.vercel.app", // Allow only your frontend
  methods: "GET,POST",
  allowedHeaders: "Content-Type",
  credentials: true,
};

app.use(cors(corsOptions));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Updated Ticket Model (Added phone and currentLocation)
const Ticket = mongoose.model(
  "Ticket",
  new mongoose.Schema({
    name: String,
    email: String,
    phone: String, // Added phone field
    currentLocation: String, // Added current location field
    travelDate: String,
    destination: String,
  })
);

// Updated GraphQL Schema
const typeDefs = gql`
  type Ticket {
    id: ID!
    name: String!
    email: String!
    phone: String!
    currentLocation: String!
    travelDate: String!
    destination: String!
  }

  type Query {
    getTickets: [Ticket]
  }

  type Mutation {
    bookTicket(
      name: String!
      email: String!
      phone: String!
      currentLocation: String!
      travelDate: String!
      destination: String!
    ): Ticket
  }
`;

// Updated Resolvers
const resolvers = {
  Query: {
    getTickets: async () => await Ticket.find(),
  },
  Mutation: {
    bookTicket: async (
      _,
      { name, email, phone, currentLocation, travelDate, destination }
    ) => {
      const ticket = new Ticket({
        name,
        email,
        phone,
        currentLocation,
        travelDate,
        destination,
      });
      await ticket.save();
      return ticket;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
  cors: {
    origin: "https://travel-booking-eta.vercel.app", // Allow frontend
    credentials: true,
  },
});

server.start().then(() => {
  server.applyMiddleware({ app, cors: false }); // Disable built-in CORS, use our settings
});

// ✅ Export `app` for Vercel instead of using `app.listen()`
module.exports = app;
