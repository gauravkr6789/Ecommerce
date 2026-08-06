import React from "react";
import { X } from "lucide-react";


const Modal = ({
  open,
  onClose,
  title,
  children
}) => {


  if(!open) return null;


  return (

    <div className="
      fixed
      inset-0
      bg-black/50
      flex
      items-center
      justify-center
      z-50
    ">

      <div className="
        bg-white
        dark:bg-gray-900
        rounded-xl
        p-6
        w-[90%]
        max-w-md
      ">


        <div className="
          flex
          justify-between
          items-center
          mb-4
        ">

          <h2 className="
            text-xl
            font-bold
            text-gray-900
            dark:text-white
          ">
            {title}
          </h2>


          <button onClick={onClose}>
            <X />
          </button>

        </div>


        {children}


      </div>

    </div>

  );
};


export default Modal;