import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth.js"

const GoogleCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { googleLogin } = useAuth();

  useEffect(() => {
    const token = params.get("token");
    const username = params.get("username");
    const avatar = params.get("avatar");
    const role = params.get("role");
    console.log("token:",token)
    console.log("avtar:",avatar.length)


    if (token) {
      googleLogin({
        token,
        user: { username, avatar, role },
      });

      navigate("/");
    }
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      Logging in with Google...
    </div>
  );
};

export default GoogleCallback;