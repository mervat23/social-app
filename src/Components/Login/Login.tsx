import { useContext, useState } from "react";
import { Button, Input, Typography } from "@heroui/react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../Context/AuthContext";

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const context = useContext(authContext);

  if (!context) {
    throw new Error("Login must be used within AuthContextProvider");
  }

  const { insertUserToken } = context;

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = z.object({
    email: z.email("invalid email"),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "password must enter",
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { touchedFields, errors },
  } = useForm<Inputs>({
    defaultValues: {
      email: "",
      password: "",
    },

    resolver: zodResolver(schema),
  });

  async function signin(values: Inputs) {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "https://route-posts.routemisr.com/users/signin",
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      insertUserToken(data.data.token);
      localStorage.setItem("token", data.data.token);
      setIsLoading(false);
      toast.success(data.message);
      navigate("/");
    } catch (e) {
      if (axios.isAxiosError(e)) {
        toast.error(e.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }
  }

  return (
    <div className="my-12">
      <Typography
        type="h1"
        align="center"
        weight="bold"
        className="my-10 text-blue-700"
      >
        Login Form
      </Typography>
      <form
        onSubmit={handleSubmit(signin)}
        className="w-full sm:w-[70%] md:w-[60%] mx-auto p-10 shadow-2xl"
      >
        <Input
          id="email"
          {...register("email")}
          type="email"
          fullWidth={true}
          placeholder="Enter Your Email"
          className="mb-5"
          variant="secondary"
        ></Input>

        {touchedFields?.email && errors?.email && (
          <p className="mb-5 text-red-700">{errors.email.message}</p>
        )}

        <Input
          id="password"
          {...register("password")}
          type="password"
          fullWidth={true}
          placeholder="Enter Your Password"
          className="mb-5"
          variant="secondary"
        ></Input>

        {touchedFields?.password && errors?.password && (
          <p className="mb-5 text-red-700">{errors.password.message}</p>
        )}

        <Button type="submit" className="my-6" fullWidth={true}>
          {isLoading ? (
            <i className="fa-spinner fa-solid fa-spin text-white"></i>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </div>
  );
};

export default Login;
