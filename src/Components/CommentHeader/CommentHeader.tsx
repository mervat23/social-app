import { useQuery } from "@tanstack/react-query";
import { Avatar, Button } from "@heroui/react";
import axios from "axios";
import type { Comment } from "../../Interfaces/CommentInterface";
import DeleteComment from "../DeleteComment/DeleteComment";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import UpdateComment from "../UpdateComment/UpdateComment";

const CommentHeader = ({ id }: { id: string }) => {
  const token = localStorage.getItem("token");

  const user = token ? jwtDecode<{ user: string }>(token).user : null;
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  function getPostComment() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}/comments`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  }
  const { data } = useQuery({
    queryKey: ["comments", id],
    queryFn: getPostComment,
  });

  return (
    <>
      {data?.data.data.comments.map(function (comment: Comment, idx: number) {
        return (
          <div key={idx}>
            <div className="comment mt-3 mb-4 bg-blue-100 rounded-md p-5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="flex items-center ">
                  <Avatar size="lg">
                    <Avatar.Image
                      alt="lkhh"
                      src={comment.commentCreator.photo}
                    ></Avatar.Image>
                    <Avatar.Fallback>mero</Avatar.Fallback>
                  </Avatar>
                  <div className="name ms-6">
                    <p>{comment.commentCreator.name}</p>
                    <p>{comment.createdAt}</p>
                  </div>
                </div>

                {user === comment.commentCreator._id ? (
                  <div className="action flex gap-2">
                    <Button onClick={() => setEditingCommentId(comment._id)}>
                      Update
                    </Button>

                    <DeleteComment postId={id} commentId={comment._id} />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            {editingCommentId === comment._id ? (
              <UpdateComment
                postId={id}
                comment={comment}
                onClose={() => setEditingCommentId(null)}
              />
            ) : (
              <>
                {comment.content ? <p>{comment.content}</p> : ""}

                {comment.image ? (
                  <img src={comment.image} className="w-1/4" alt="" />
                ) : (
                  ""
                )}
              </>
            )}
          </div>
        );
      })}
    </>
  );
};

export default CommentHeader;
