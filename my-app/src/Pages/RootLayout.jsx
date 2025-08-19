import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Windowresponsiv from "../Components/Windowresponsiv";
import { clearError } from "../store/errorSlice";
const RootLayout = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();
  const dispatch = useDispatch();
  const { width } = Windowresponsiv();
  useEffect(() => {
    dispatch(clearError()); // Clear errors on route change
  }, [location.pathname, dispatch]);
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default RootLayout;
