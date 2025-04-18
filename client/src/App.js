import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import "./App.css";
import Layout from "./Layout";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import Home from "./components/Home/Home";
import Shop from "./components/Shop/Shop";
import CustomerLogin from "./components/Customer/CustomerLogin";
import CustomerRegister from "./components/Customer/CustomerRegister";
import PrescriptionUpload from "./components/Customer/PrescriptionUpload";
import Cart from "./components/Cart/Cart";
import CustomerProfile from "./components/Customer/CustomerProfile";
import OrderHistory from "./components/Customer/OrderHistory";
import OrderDetails from "./components/Customer/OrderDetails";
import Support from "./components/Customer/Support";
import PharmacyLogin from "./components/Pharmacy/PharmacyLogin";
import PharmacyRegister from "./components/Pharmacy/PharmacyRegister";
import PharmacyDashboard from "./components/Pharmacy/PharmacyDashboard";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminUsers from "./components/Admin/AdminUsers";
import AdminPharmacies from "./components/Admin/AdminPharmacies";
import AdminOrders from "./components/Admin/AdminOrders";
import EditMedicine from "./components/Pharmacy/EditMedicine";
import MedicineDetail from './components/Pharmacy/MedicineDetail';
import AddMedicine from "./components/Pharmacy/AddMedicine";
import React from "react";
function App() {
  return (    
    <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/register" element={<CustomerRegister />} />            
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact/>}/>
              <Route path="/support" element={<Support />} />
            {/* Customer Routes */}
            <Route element={<ProtectedRoute allowedRole={'customer'} fallbackPath="/customer/login" />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<CustomerProfile />} />
              <Route path="/prescription/upload" element={<PrescriptionUpload />} />
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="/order/:orderId" element={<OrderDetails />} />
            </Route>

            {/* Pharmacy Routes */}
            <Route path="/medicines/:id" element={<MedicineDetail />} />
            <Route path="/pharmacy/login" element={<PharmacyLogin />} />
            <Route path="/pharmacy/register" element={<PharmacyRegister />} />
            <Route element={<ProtectedRoute allowedRole={'pharmacy'} fallbackPath="/pharmacy/login" />}>
              <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
              <Route path="/pharmacy/add-medicine" element={<AddMedicine />} />
              <Route path="/pharmacy/edit-medicine/:id" element={<EditMedicine />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute allowedRole={'admin'} fallbackPath="/admin/login" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/pharmacies" element={<AdminPharmacies />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
            </Route>

            {/* Unauthorized access redirects */}
            <Route path="/admin/*" element={<Navigate to="/AdminLogin" />} />
            <Route path="/pharmacy/*" element={<Navigate to="/PharmacyLogin" />} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
}

export default App;