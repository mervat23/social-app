import { Button, Input } from "@heroui/react";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRef } from "react";

const ChangePassword = () => {
  const password = useRef<HTMLInputElement>(null);
  const newPassword = useRef<HTMLInputElement>(null);

  function changePassword() {
    return axios.patch(
      "https://route-posts.routemisr.com/users/change-password",
      {
        password: password.current?.value,
        newPassword: newPassword.current?.value,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      },
    );
  }

  const { isPending, mutate } = useMutation({
    mutationFn: changePassword,

    onSuccess: (data) => {
      toast.success(data.data.message);

      if (data.data.token) {
        localStorage.setItem("token", data.data.token);
      }

      if (password.current) {
        password.current.value = "";
      }

      if (newPassword.current) {
        newPassword.current.value = "";
      }
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  return (
    <div className="w-full md:w-1/2 mx-auto bg-blue-100 p-5 my-5 rounded-md flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-5 text-blue-700">Change Password</h1>

      <Input
        ref={password}
        type="password"
        placeholder="Current password"
        className="mb-4"
      />

      <Input
        ref={newPassword}
        type="password"
        placeholder="New password"
        className="mb-4"
      />

      <Button onClick={() => mutate()} isDisabled={isPending} variant="primary">
        {isPending ? (
          <i className="fa-solid fa-spinner fa-spin"></i>
        ) : (
          "Change Password"
        )}
      </Button>
    </div>
  );
};

export default ChangePassword;
