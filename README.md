# Woody Prieb Dharmoscience Series Book Donation Campaign

A donation-based platform for distributing Buddhist books and educational materials to recipients in need worldwide. Built with Vue.js, Firebase, and Tailwind CSS.

## Features

- User authentication (register, login, profile management)
- Product browsing and searching
- Shopping cart functionality
- Order processing
- Admin dashboard for product and order management
- Responsive design for all devices

## Technologies Used

- Vue.js 3 with Composition API
- Vue Router for navigation
- Pinia for state management
- Firebase (Authentication, Firestore, Storage)
- Tailwind CSS for styling
- Font Awesome for icons

## Project Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:

```
git clone <repository-url>
cd b-commerce
```

2. Install dependencies:

```
npm install
```

3. Configure Firebase:

   - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password), Firestore, and Storage
   - Update the Firebase configuration in `src/firebase/config.js` with your project details
   - Deploy to [https://woodyprieb.com/](https://woodyprieb.com/)

4. Run the development server:

```
npm run dev
```

5. Build for production:

```
npm run build
```

## Project Structure

- `src/components` - Reusable Vue components
- `src/views` - Page components
- `src/stores` - Pinia stores for state management
- `src/firebase` - Firebase configuration and service functions
- `src/router` - Vue Router configuration
- `src/assets` - Static assets like images and global CSS

## Firebase Setup

1. Create a Firebase project
2. Enable Authentication with Email/Password
3. Create a Firestore database with the following collections:
   - `products`
   - `orders`
   - `users`
4. Set up Storage for product images
5. Update the security rules for Firestore and Storage

## License

[MIT](LICENSE)
