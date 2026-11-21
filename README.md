# 🔧 FixMate – Home Service & Repair Platform

**FixMate – Your Home, Our Responsibility.**

FixMate is a full-stack home service and repair platform that connects customers with skilled technicians. Customers can explore repair services, book technicians, manage service requests, and make secure online payments.

The platform provides separate dashboards for customers, technicians, and administrators to ensure smooth service management and an organized workflow.

## 🌐 Live Project Links

- **Frontend:** https://fixmate-frontend-five.vercel.app/
- **Backend API:** https://fixmate-backend-snowy.vercel.app/

## ✨ Top 15 Features of FixMate

1. **Role-Based Authentication** – Secure authentication with separate access for customers, technicians, and administrators.

2. **Service Discovery** – Browse available home repair services with detailed descriptions, pricing, and categories.

3. **Service Categories** – Explore services organized into categories such as Smartphone, Laptop & PC, AC, Refrigerator, and more.

4. **Service Booking System** – Customers can easily book repair services by providing their contact information, address, preferred date, and problem description.

5. **Booking Management** – Customers can view and manage their service requests and track booking progress.

6. **Request Cancellation** – Customers can cancel a service request while its status is still `requested`.

7. **Technician Dashboard** – Dedicated dashboard for technicians to manage assigned repair requests.

8. **Booking Status Management** – Technicians can manage service requests through different stages, including accepted, in-progress, and completed.

9. **Admin Dashboard** – Comprehensive admin dashboard with platform statistics and management tools.

10. **User Role Management** – Administrators can view registered users and change their roles.

11. **Service Approval Management** – Administrators can review, approve, and delete services.

12. **Booking Administration** – Administrators can monitor customer bookings and manage booking statuses.

13. **Stripe Payment Integration** – Online payments through Stripe Checkout with payment verification and webhook support.

14. **Transaction Management** – Administrators can monitor payments, view transaction details, and track platform revenue.

15. **Responsive UI & Theme Support** – Modern, responsive interface with light and dark mode, loading states, and a custom 404 page.

## 🎨 Additional UI Highlights

- Modern and clean dashboard design.
- Responsive layouts for mobile, tablet, and desktop.
- Reusable React components.
- Interactive notifications and feedback.
- Custom loading and skeleton screens.
- User-friendly navigation and forms.
- Consistent FixMate green/lime color theme.

## 🛠️ Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React
- Better Auth

### Backend & Database

- Node.js
- Express.js
- MongoDB
- REST API

### Payment Integration

- Stripe Checkout
- Stripe Webhooks

### Deployment & Tools

- Vercel
- Git & GitHub
- Stripe CLI

## 📁 Project Structure

```text
fixmate-frontend/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   │   ├── users/
│   │   │   │   ├── services/
│   │   │   │   ├── bookings/
│   │   │   │   └── transactions/
│   │   │   │
│   │   │   ├── customer/
│   │   │   └── technician/
│   │   │
│   │   ├── services/
│   │   ├── signin/
│   │   ├── signup/
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   └── lib/
│
├── .env.local
├── package.json
├── tsconfig.json
└── README.md
```

*Note: This is a simplified overview of the frontend project structure.*

## ⚙️ Installation & Setup

Follow these steps to run the FixMate frontend locally.

### 1. Clone the Repository

```bash
git clone YOUR_FRONTEND_REPOSITORY_URL
```

### 2. Navigate to the Project Directory

```bash
cd fixmate-frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=https://fixmate-backend-snowy.vercel.app
```

### 5. Run the Development Server

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

**Important:** Never expose private API keys, database credentials, Stripe secret keys, or authentication secrets in frontend environment variables.

## 💳 Payment Integration

FixMate integrates Stripe to handle online payments.

### Payment Workflow

1. Customer books a service.
2. Technician accepts and completes the service.
3. Customer proceeds to payment.
4. Backend creates a Stripe Checkout Session.
5. Customer completes payment through Stripe Checkout.
6. Backend verifies the payment and processes the Stripe webhook.
7. Payment status and transaction information are updated.
8. Administrators can view transaction records from the dashboard.

## 👥 User Roles

### Customer

- Browse available repair services.
- View service details and pricing.
- Book repair services.
- Manage and track service requests.
- Cancel pending requests.
- Make online payments.
- View booking and payment information.

### Technician

- Access a dedicated technician dashboard.
- View assigned service requests.
- Manage booking requests.
- Update service request statuses.
- Track ongoing and completed jobs.

### Administrator

- View platform statistics.
- Manage registered users and user roles.
- Manage services and service approvals.
- Monitor and manage bookings.
- View payment transactions.
- Track payment information and revenue.

## 🚀 Backend API

FixMate uses a separate Express.js backend with MongoDB for data storage and REST API communication.

**Live Backend:** https://fixmate-backend-snowy.vercel.app/

The backend handles:

- Authentication and authorization.
- User and role management.
- Service management.
- Booking and request management.
- Payment processing.
- Stripe webhook handling.
- Transaction management.

## 🌍 Deployment

The frontend and backend are deployed separately using Vercel.

- **Frontend:** Vercel
- **Backend:** Vercel
- **Database:** MongoDB Atlas
- **Payment Gateway:** Stripe

## 🎯 Project Purpose

The main goal of FixMate is to simplify the home repair service booking process by connecting customers with skilled technicians through a user-friendly digital platform.

It demonstrates practical full-stack development skills, including authentication, role-based authorization, REST API integration, database operations, dashboard management, and payment gateway integration.

## 👨‍💻 Developer

**Sudipto Roy**

- GitHub: [sudiptoroy12](https://github.com/sudiptoroy12)
- LinkedIn: [Sudipto Roy](https://www.linkedin.com/in/sudipto-roy-82602415b/)

---

⭐ If you find this project interesting, consider giving it a star!

**FixMate – Your Home, Our Responsibility.**