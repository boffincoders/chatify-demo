import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const PrivatePage = ({ Children }: any) => {
  let loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser") ?? (null as any)
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (!loggedInUser) navigate("/login");
    else if (!loggedInUser.last_login) navigate("/add-profile");
  }, [loggedInUser]);
  return (
    <div>
      <Children />
    </div>
  );
};

export default PrivatePage;
