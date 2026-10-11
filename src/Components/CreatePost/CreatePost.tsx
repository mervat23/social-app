import { TextArea, Button } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const CreatePost = () => {
  const queryClient = useQueryClient();

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [img, setImg] = useState<File | null>(null);
  const postBody = useRef<HTMLTextAreaElement>(null);
  const postImage = useRef<HTMLInputElement>(null);

  const { isPending, mutate } = useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      toast.success(data.data.message);

      queryClient.invalidateQueries({
        queryKey: ["Posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["UserPost"],
      });
      closeImg();
      if (postBody.current) {
        postBody.current.value = "";
      }
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to create post");
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  function createPost() {
    const formData = new FormData();

    const body = postBody.current?.value.trim();

    if (body) {
      formData.append("body", body);
    }

    if (img) {
      formData.append("image", img);
    }

    return axios.post(`https://route-posts.routemisr.com/posts`, formData, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  }

  function handleImg() {
    const file = postImage.current?.files?.[0];

    if (!file) return;

    setImgSrc(URL.createObjectURL(file));
    setImg(file);
  }

  function closeImg() {
    if (imgSrc) {
      URL.revokeObjectURL(imgSrc);
    }

    setImgSrc(null);
    setImg(null);

    if (postImage.current) {
      postImage.current.value = "";
    }
  }
  return (
    <div className="bg-blue-100 w-full mx-auto md:w-1/2 my-5 p-5">
      <TextArea
        ref={postBody}
        rows={4}
        fullWidth={true}
        placeholder="enter your post body"
      ></TextArea>
      {imgSrc ? (
        <div className="my-5">
          <i onClick={closeImg} className="fa-solid fa-xmark "></i>
          <img src={imgSrc} className="w-full" alt="" />
        </div>
      ) : (
        <div className="flex my-5 items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium"
          >
            <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            <input
              onChange={handleImg}
              ref={postImage}
              id="dropzone-file"
              type="file"
              className="hidden"
            />
          </label>
        </div>
      )}

      <Button onClick={() => mutate()} variant="primary" className="block">
        {isPending ? (
          <i className="fa-solid fa-spinner fa-spin text-white"></i>
        ) : (
          "create post"
        )}
      </Button>
    </div>
  );
};

export default CreatePost;
