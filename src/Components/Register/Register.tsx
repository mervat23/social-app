import { useState } from "react";
import { Button, Input, Typography } from "@heroui/react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = z
    .object({
      name: z.string().min(3, "min length 3").max(15, "max length 15"),
      username: z.string().regex(/^[a-z0-9]{3,20}$/, "min length 3 and max 20"),
      email: z.email("invalid email"),
      dateOfBirth: z.coerce.date().refine(
        function (value) {
          const year = new Date().getFullYear();
          const userYear = value.getFullYear();
          if (year - userYear >= 18) {
            return true;
          }
          return false;
        },
        { message: "invalid dateOfBirth", path: ["dateOfBirth"] },
      ),

      gender: z.enum(["male", "female"], "male or female"),
      password: z
        .string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "password must enter",
        ),
      rePassword: z
        .string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "rePassword must enter",
        ),
    })
    .refine(
      function (values) {
        if (values.password === values.rePassword) {
          return true;
        }
        return false;
      },
      {
        message: "rePassword is not the same as password",
        path: ["rePassword"],
      },
    );

  const {
    register,
    handleSubmit,
    formState: { touchedFields, errors },
  } = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: undefined,
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(schema),
  });
  async function signup(values: z.output<typeof schema>) {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "https://route-posts.routemisr.com/users/signup",
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      setIsLoading(false);
      toast.success(data.message);
      navigate("/login");
    } catch (e) {
      if (axios.isAxiosError(e)) {
        toast.error(e.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
      setIsLoading(false);
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
        Register Form
      </Typography>
      <form
        onSubmit={handleSubmit(signup)}
        className="w-[60%] mx-auto p-10 shadow-2xl"
      >
        <Input
          id="name"
          {...register("name")}
          type="text"
          fullWidth={true}
          placeholder="Enter Your Name"
          className="mb-5"
          variant="secondary"
        ></Input>

        {touchedFields?.name && errors?.name && (
          <p className="mb-5 text-red-700">{errors.name.message}</p>
        )}

        <Input
          id="username"
          {...register("username")}
          type="text"
          fullWidth={true}
          placeholder="Enter Your username"
          className="mb-5"
          variant="secondary"
        ></Input>

        {touchedFields?.username && errors?.username && (
          <p className="mb-5 text-red-700">{errors.username.message}</p>
        )}

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

        <Input
          id="rePassword"
          {...register("rePassword")}
          type="password"
          fullWidth={true}
          placeholder="Enter Your rePassword"
          className="mb-5"
          variant="secondary"
        ></Input>

        {touchedFields?.rePassword && errors?.rePassword && (
          <p className="mb-5 text-red-700">{errors.rePassword.message}</p>
        )}

        <Input
          type="date"
          {...register("dateOfBirth")}
          fullWidth={true}
          placeholder="Enter Your date of birth"
          className="mb-5"
          variant="secondary"
        ></Input>

        {touchedFields?.dateOfBirth && errors?.dateOfBirth && (
          <p className="mb-5 text-red-700">{errors.dateOfBirth.message}</p>
        )}

        <div>
          <label htmlFor="male" className="me-3">
            Male
          </label>
          <input
            {...register("gender")}
            type="radio"
            value="male"
            id="male"
            name="gender"
          />

          {touchedFields?.gender && errors?.gender && (
            <p className="mb-5 text-red-700">{errors.gender.message}</p>
          )}

          <label htmlFor="female" className="ms-8 me-3">
            Female
          </label>
          <input
            {...register("gender")}
            type="radio"
            value="female"
            id="female"
            name="gender"
          />

          {touchedFields?.gender && errors?.gender && (
            <p className="mb-5 text-red-700">{errors.gender.message}</p>
          )}
        </div>
        <Button type="submit" className="my-6" fullWidth={true}>
          {isLoading ? (
            <i className="fa-spinner fa-solid fa-spin text-white"></i>
          ) : (
            "Register"
          )}
        </Button>
      </form>
    </div>
  );
};

export default Register;
