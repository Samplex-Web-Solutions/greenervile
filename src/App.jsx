import {Suspense} from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import DashboardLayout from './Components/Layout/DashboardLayout';
import NotFound from './Components/NotFound/NotFound';
import ScrollToTop from './Components/Layout/ScrollToTop';



//Public Pages
import Home from './Pages/Home';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/SignUp';
import ForgetPassword from './Components/Auth/ForgetPassword';

//User Pages
import MarketPlace from './Pages/User/MarketPlace';
import Dashboard from './Pages/User/Dashboard';
import Deposit from './Pages/User/Deposit';
import Transaction from './Pages/User/Transaction';
import Setting from './Pages/User/Settings'
import WithdrawalPage from './Pages/User/Withdrawal';

//Admin pages
import VilePanel from './Pages/CMS/VilePanel';
import ManageUsers from './Pages/CMS/ManageUsers';
import TransactionHistory from './Pages/CMS/TransactionHistory';
import Settings from './Pages/CMS/AccountSettings';
import Market from './Pages/CMS/Market';
import LoadingSpinner from './Components/UI/LoadingSpinner';
import AdminTransactionReview from './Pages/CMS/AdminTransactionAproval';
import AdminDepositSettings from './Pages/CMS/DepositSetting';
import AdminInvestmentReview from './Pages/CMS/AdminInvestmentReview';

function App() {

  return (
      <Suspense fallback={<LoadingSpinner />}>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='/recover-account' element={<ForgetPassword />} />
            <Route path='/home' element={<Home />} />

            <Route element={<DashboardLayout />}>

              {/* User Routes */}
              <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/market" element={<MarketPlace />} />
                <Route path="/deposit" element={<Deposit />} />
                <Route path="/transaction" element={<Transaction />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/withdraw" element={<WithdrawalPage />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/panel/*" element={<VilePanel />} />
                <Route path="/panel/users" element={<ManageUsers />} />
                <Route path="/panel/addhistory/" element={<TransactionHistory />} />
                <Route path="/panel/settings" element={<Settings />} />
                <Route path='/panel/market' element={<Market />} />
                <Route path='/panel/reviews' element={<AdminTransactionReview />} />
                <Route path='/panel/deposit-settings' element={<AdminDepositSettings />} />
                <Route path='/panel/investments' element={<AdminInvestmentReview />} />
              </Route>

            </Route>

            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </Suspense>
  );
}

export default App;