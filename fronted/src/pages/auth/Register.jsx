import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaGoogle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { toast } from "react-toastify";
import { useAuth } from "../../hooks/auth/useAuth.js";


const Register = () => {

  const navigate = useNavigate();

  const { registerMutation } = useAuth();


  const [showPassword,setShowPassword] = useState(false);

  const [showConfirmPassword,setShowConfirmPassword] = useState(false);



  const [formData,setFormData] = useState({
    username:"",
    email:"",
    phone:"",
    password:"",
    confirmPassword:"",
    role:"user"
  });



  const handleChange=(e)=>{

    setFormData((prev)=>({
      ...prev,
      [e.target.name]:e.target.value
    }));

  };



  const handleSubmit=async(e)=>{

    e.preventDefault();


    if(formData.password !== formData.confirmPassword){

      toast.error("Passwords do not match");
      return;

    }



    try{

      await registerMutation.mutateAsync(formData);


      toast.success(
        "Account Created Successfully"
      );


      navigate("/login");


    }
    catch(error){

      toast.error(
        error?.response?.data?.message ||
        "Registration failed"
      );

    }

  };




  const handleGoogleSignup=()=>{

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
py-10
"
>



{/* Background */}

<div
className="
absolute
w-80
h-80
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
w-96
h-96
bg-purple-500
rounded-full
blur-3xl
opacity-30
bottom-10
right-10
"
/>





<div
className="
relative
z-10
w-full
max-w-lg
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
Create Account
</h1>



<p
className="
mt-3
text-gray-600
dark:text-gray-400
"
>
Join our ecommerce platform today
</p>


</div>







<form
onSubmit={handleSubmit}
className="space-y-4"
>





{/* Username */}


<InputField
icon={<FaUser/>}
type="text"
name="username"
placeholder="Username"
value={formData.username}
onChange={handleChange}
/>





{/* Email */}

<InputField
icon={<FaEnvelope/>}
type="email"
name="email"
placeholder="Email Address"
value={formData.email}
onChange={handleChange}
/>





{/* Phone */}

<InputField
icon={<FaPhone/>}
type="text"
name="phone"
placeholder="Phone Number"
value={formData.phone}
onChange={handleChange}
/>







{/* Role */}

<select

name="role"

value={formData.role}

onChange={handleChange}

className="
w-full
py-3
px-4
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
"

>


<option value="user">
User
</option>


<option value="admin">
Admin
</option>


</select>







{/* Password */}


<PasswordField

show={showPassword}

setShow={setShowPassword}

name="password"

placeholder="Password"

value={formData.password}

onChange={handleChange}

/>





{/* Confirm Password */}


<PasswordField

show={showConfirmPassword}

setShow={setShowConfirmPassword}

name="confirmPassword"

placeholder="Confirm Password"

value={formData.confirmPassword}

onChange={handleChange}

/>







<button

disabled={registerMutation.isPending}

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
registerMutation.isPending
?
"Creating..."
:
"Create Account"
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

<div className="
flex-1
border-t
border-gray-300
dark:border-gray-700
"
/>


<span className="text-gray-500 text-sm">
OR
</span>


<div className="
flex-1
border-t
border-gray-300
dark:border-gray-700
"
/>


</div>






{/* Google */}


<button

onClick={handleGoogleSignup}

className="
w-full
py-3
rounded-xl
border
border-gray-300
dark:border-gray-700
bg-white
dark:bg-gray-800
text-gray-900
dark:text-white
flex
justify-center
items-center
gap-3
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

Already have an account?

{" "}

<Link

to="/login"

className="
text-indigo-600
dark:text-indigo-400
font-semibold
hover:underline
"

>
Login
</Link>

</p>





</div>


</div>

);

};





const InputField=({
icon,
...props
})=>(
<div className="relative">

<div
className="
absolute
left-4
top-4
text-gray-400
"
>
{icon}
</div>


<input

{...props}

required

className="
w-full
pl-11
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
);







const PasswordField=({
show,
setShow,
...props
})=>(

<div className="relative">


<div
className="
absolute
left-4
top-4
text-gray-400
"
>
<FaLock/>
</div>



<input

{...props}

required

type={show ? "text":"password"}

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

onClick={()=>setShow(!show)}

className="
absolute
right-4
top-4
text-gray-500
"

>

{
show
?
<FaEyeSlash/>
:
<FaEye/>
}

</button>



</div>

);


export default Register;
