import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, ShoppingBag, LayoutDashboard, LogOut } from "lucide-react";

import { useAuth } from "../../hooks/auth/useAuth.js";
import { getInitials } from "../../utils/getInitials.js";


const UserMenu = () => {

  const { user, logout } = useAuth();

  const [open,setOpen] = useState(false);

  const navigate = useNavigate();



  if(!user) return null;



  return (

    <div className="relative">


      {/* User Button */}

      <button

        onClick={()=>setOpen(!open)}

        className="
        flex
        items-center
        gap-3
        cursor-pointer
        rounded-full
        px-2
        py-1
        hover:bg-gray-100
        dark:hover:bg-gray-800
        transition
        "

      >



        {
          user.avatar ?

          (

            <img
              src={user.avatar}
              alt={user.username}
              className="
              w-10
              h-10
              rounded-full
              object-cover
              border-2
              border-indigo-500
              "
            />

          )

          :

          (

            <div
            className="
            w-10
            h-10
            rounded-full
            bg-gradient-to-r
            from-indigo-600
            to-purple-600
            text-white
            flex
            items-center
            justify-center
            font-bold
            "
            >
              {getInitials(user.username)}
            </div>

          )

        }




        <div className="hidden md:block text-left">


          <p
          className="
          text-sm
          font-semibold
          text-gray-900
          dark:text-white
          "
          >
            {user.username}
          </p>


          <p
          className="
          text-xs
          text-gray-500
          dark:text-gray-400
          capitalize
          "
          >
            {user.role}
          </p>


        </div>



      </button>







      {/* Dropdown */}

      {
        open && (

          <div

          className="
          absolute
          right-0
          mt-3
          w-56
          rounded-2xl
          bg-white/90
          dark:bg-gray-900/90
          backdrop-blur-xl
          border
          border-gray-200
          dark:border-gray-700
          shadow-2xl
          overflow-hidden
          z-50
          "

          >




            {/* Profile */}

            <button

            onClick={()=>navigate("/profile")}

            className="
            w-full
            flex
            items-center
            gap-3
            px-5
            py-3
            text-sm
            text-gray-700
            dark:text-gray-200
            hover:bg-indigo-50
            dark:hover:bg-gray-800
            transition
            "

            >

              <User size={18}/>

              Profile

            </button>







            {/* Orders */}

            <button

            onClick={()=>navigate("/orders")}

            className="
            w-full
            flex
            items-center
            gap-3
            px-5
            py-3
            text-sm
            text-gray-700
            dark:text-gray-200
            hover:bg-indigo-50
            dark:hover:bg-gray-800
            transition
            "

            >

              <ShoppingBag size={18}/>

              Orders

            </button>








            {/* Admin */}

            {
              user.role==="admin" && (

                <button

                onClick={()=>navigate("/admin")}

                className="
                w-full
                flex
                items-center
                gap-3
                px-5
                py-3
                text-sm
                text-indigo-600
                dark:text-indigo-400
                hover:bg-indigo-50
                dark:hover:bg-gray-800
                transition
                "

                >

                <LayoutDashboard size={18}/>

                Admin Panel

                </button>

              )
            }







            <div
            className="
            border-t
            border-gray-200
            dark:border-gray-700
            "
            />







            {/* Logout */}

            <button

            onClick={logout}

            className="
            w-full
            flex
            items-center
            gap-3
            px-5
            py-3
            text-sm
            text-red-600
            hover:bg-red-50
            dark:hover:bg-red-900/20
            transition
            "

            >

              <LogOut size={18}/>

              Logout

            </button>



          </div>

        )
      }



    </div>

  );
};


export default UserMenu;