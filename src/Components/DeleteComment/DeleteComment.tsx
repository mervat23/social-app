import { Button, toast } from "@heroui/react";
import React from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
      toast.error(error.response.data.message);
    },
  });
  return (
    <div>
      <Button variant="danger" onClick={mutate}>
        Delete
      </Button>
    </div>
  );
};

export default DeleteComment;
