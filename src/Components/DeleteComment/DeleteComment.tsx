import { Button } from "@heroui/react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const DeleteComment = ({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}) => {
  const queryClient = useQueryClient();

  function DeleteComment() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      },
    );
  }

  const { isPending, mutate } = useMutation({
    mutationFn: DeleteComment,
    onSuccess: (data) => {
      toast.success(data.data.message);
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
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
    <div>
      <Button variant="danger" onClick={() => mutate()}>
        {isPending ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
};

export default DeleteComment;
