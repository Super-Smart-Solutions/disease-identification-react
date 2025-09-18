import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { userToggleOptions } from "./navConfig";
import DropdownMenu from "./../../DropdownMenu";
import { useAuthActions } from "./../../helpers/authHelpers";
import useNavigation from "../../../hooks/useNavigation";

const UserDropdown = ({ t, user }) => {
  const { logout } = useAuthActions();
  const { handleRoute } = useNavigation();

  const options = userToggleOptions(t, logout, handleRoute)(user);

  return (
    <div className=" my-auto">
      {user?.id ? (
        <DropdownMenu
          buttonContent={
            <div className=" flex gap-2 items-center">
              <img
                src={user?.avatar_url || "/user-avatar.png"}
                alt="User avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <strong className=" text-lg">
                {" "}
                {`${t("welcome_key")}  ${user?.first_name}`}{" "}
              </strong>
            </div>
          }
          options={options}
        />
      ) : (
        <span className=" flex items-center justify-between gap-2 select-none">
          <FaUserCircle size={24} />
          {t("welcome_text_key")}
        </span>
      )}
    </div>
  );
};

export default UserDropdown;
