import { Button, Input } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const CreateComment = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [img, setImg] = useState<File | null>(null);

  const commentContent = useRef<HTMLInputElement>(null);
  const commentImage = useRef<HTMLInputElement>(null);

  const { isPending, mutate } = useMutation({
    mutationFn: createComment,
    onSuccess: (data) => {
      toast.success(data.data.message);
      queryClient.invalidateQueries({
        queryKey: ["comments", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["Posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["UserPost"],
      });
      closeImg();
      if (commentContent.current) {
        commentContent.current.value = "";
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

  function createComment() {
    const formData = new FormData();
    if (
      commentContent.current?.value &&
      commentContent.current.value.trim() !== ""
    ) {
      formData.append("content", commentContent.current.value);
    }

    if (img) {
      formData.append("image", img);
    }

    return axios.post(
      `https://route-posts.routemisr.com/posts/${id}/comments`,
      formData,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      },
    );
  }

  function handleImg() {
    const file = commentImage.current?.files?.[0];

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

    if (commentImage.current) {
      commentImage.current.value = "";
    }
  }

  return (
    <div>
      <div className="bg-blue-100 my-5 p-5">
        <Input
          ref={commentContent}
          type="text"
          fullWidth={true}
          placeholder="enter your comment"
        />
        {imgSrc ? (
          <div className="my-5">
            <i
              onClick={closeImg}
              className="fa-solid fa-xmark cursor-pointer"
            ></i>
            <img src={imgSrc} className="w-1/2" alt="" />
          </div>
        ) : (
          <Input
            onChange={handleImg}
            ref={commentImage}
            type="file"
            // className="my-4"
              className="my-4 w-full min-w-0"

          />
        )}

        <Button onClick={() => mutate()} variant="primary" className="block">
          {isPending ? (
            <i className="fa-solid fa-spinner fa-spin text-white"></i>
          ) : (
            "create comment"
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreateComment;
