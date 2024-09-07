# AutoSpa Deluxe

AutoSpa Deluxe is a modern web application for car wash management. It features real-time tracking, appointment scheduling, and admin controls.

## Technologies Used

- Frontend: React with TypeScript, Vite
- Backend: Node.js, Express
- Database: PostgreSQL
- ORM: TypeORM
- Real-time updates: Socket.io
- Caching: Redis
- Authentication: JWT

## Getting Started

### Prerequisites

- Node.js
- npm
- PostgreSQL
- Redis

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/gonzalolavin99/Car-Wash.git
   cd car-wash
   ```

2. Install dependencies:
   ```
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

3. Set up your environment variables (create a `.env` file in the server directory).

4. Start the development servers:
   ```
   # In the client directory
   npm run dev

   # In the server directory
   npm run dev
   ```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.