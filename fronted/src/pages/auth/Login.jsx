import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { useAuth } from "../../hooks/auth/useAuth.js";
import { toast } from "react-toastify";


const Login = () => {

  const navigate = useNavigate();

  const { loginMutation } = useAuth();


  const [showPassword, setShowPassword] = useState(false);


  const [formData, setFormData] = useState({
    email:"",
    password:"",
  });



  const handleChange=(e)=>{

    setFormData((prev)=>({
      ...prev,
      [e.target.name]:e.target.value
    }));

  };



  const handleSubmit=async(e)=>{

    e.preventDefault();

    try{

      const user = await loginMutation.mutateAsync(formData);

      toast.success("Login successful");


      if(user?.role==="admin"){
        navigate("/admin");
      }
      else{
        navigate("/");
      }

    }
    catch(error){

      toast.error(
        error?.response?.data?.message ||
        "Login failed"
      );

    }

  };



  const handleGoogleLogin=()=>{

    window.location.href =
    `${import.meta.env.VITE_API_URL}/auth/google`;

  };





return (

<div
className="
min-h-screen
flex
items-center
justify-center
relative
overflow-hidden
bg-gray-100
dark:bg-gray-950
px-4
"
>


{/* Background blobs */}

<div
className="
absolute
w-72
h-72
bg-indigo-500
rounded-full
blur-3xl
opacity-30
top-10
left-10
"
/>


<div
className="
absolute
w-80
h-80
bg-purple-500
rounded-full
blur-3xl
opacity-30
bottom-10
right-10
"
/>





{/* Card */}

<div
className="
relative
z-10
w-full
max-w-md
bg-white/80
dark:bg-gray-900/80
backdrop-blur-xl
border
border-gray-200
dark:border-gray-700
rounded-3xl
shadow-2xl
p-8
"
>



<div className="text-center mb-8">


<h1
className="
text-4xl
font-bold
text-gray-900
dark:text-white
"
>
Welcome Back
</h1>


<p
className="
mt-3
text-gray-600
dark:text-gray-400
"
>
Login to continue shopping
</p>


</div>





<form
onSubmit={handleSubmit}
className="space-y-5"
>



{/* Email */}

<div>

<label
className="
block
mb-2
text-sm
font-medium
text-gray-700
dark:text-gray-300
"
>
Email
</label>


<div className="relative">

<FaEnvelope
className="
absolute
left-4
top-4
text-gray-400
"
/>


<input

type="email"

name="email"

value={formData.email}

onChange={handleChange}

required

placeholder="Enter your email"

className="
w-full
pl-11
pr-4
py-3
rounded-xl
border
border-gray-300
dark:border-gray-700
bg-white
dark:bg-gray-800
text-gray-900
dark:text-white
outline-none
focus:ring-2
focus:ring-indigo-500
transition
"

/>


</div>

</div>







{/* Password */}


<div>


<label
className="
block
mb-2
text-sm
font-medium
text-gray-700
dark:text-gray-300
"
>
Password
</label>



<div className="relative">


<FaLock
className="
absolute
left-4
top-4
text-gray-400
"
/>



<input

type={
showPassword
?"text"
:"password"
}

name="password"

value={formData.password}

onChange={handleChange}

required

placeholder="Enter password"


className="
w-full
pl-11
pr-12
py-3
rounded-xl
border
border-gray-300
dark:border-gray-700
bg-white
dark:bg-gray-800
text-gray-900
dark:text-white
outline-none
focus:ring-2
focus:ring-indigo-500
transition
"

/>



<button

type="button"

onClick={()=>setShowPassword(!showPassword)}

className="
absolute
right-4
top-4
text-gray-500
"

>

{
showPassword
?
<FaEyeSlash/>
:
<FaEye/>
}

</button>


</div>


</div>





{/* Forgot */}

<div className="flex justify-end">

<Link

to="/forgot-password"

className="
text-indigo-600
dark:text-indigo-400
text-sm
hover:underline
"

>
Forgot Password?
</Link>

</div>







{/* Login button */}


<button

disabled={loginMutation.isPending}

className="
w-full
py-3
rounded-xl
bg-indigo-600
hover:bg-indigo-700
text-white
font-semibold
transition
shadow-lg
disabled:opacity-50
"

>

{
loginMutation.isPending
?
"Logging In..."
:
"Login"
}


</button>


</form>








{/* Divider */}


<div
className="
my-6
flex
items-center
gap-3
"
>

<div
className="
flex-1
border-t
border-gray-300
dark:border-gray-700
"
/>


<span
className="
text-sm
text-gray-500
"
>
OR
</span>


<div
className="
flex-1
border-t
border-gray-300
dark:border-gray-700
"
/>


</div>







{/* Google */}

<button

onClick={handleGoogleLogin}

className="
w-full
py-3
rounded-xl
border
border-gray-300
dark:border-gray-700
flex
items-center
justify-center
gap-3
bg-white
dark:bg-gray-800
text-gray-800
dark:text-white
hover:bg-gray-100
dark:hover:bg-gray-700
transition
"

>


<FaGoogle className="text-red-500"/>


Continue with Google


</button>






<p
className="
text-center
mt-6
text-gray-600
dark:text-gray-400
"
>

Don't have an account?

{" "}

<Link

to="/register"

className="
text-indigo-600
dark:text-indigo-400
font-semibold
hover:underline
"

>
Register
</Link>


</p>





</div>


</div>

);

};


export default Login;