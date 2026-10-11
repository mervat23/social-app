import { TextArea, Button, toast } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useRef, useState } from 'react'
import type { Comment } from '../../Interfaces/CommentInterface'

const UpdateComment = ({
  postId,
  comment,
  onClose
}: {
  postId: string
  comment: Comment
  onClose: () => void
}) => {

  const queryClient = useQueryClient()

  const [imgSrc, setImgSrc] = useState(comment.image || null)
  const [img, setImg] = useState<File | null>(null)

  const commentContent = useRef<HTMLTextAreaElement>(null)
  const commentImage = useRef<HTMLInputElement>(null)

  function updateComment() {

    const formData = new FormData()

    if (commentContent.current?.value) {
      formData.append('content', commentContent.current.value)
    }

    if (img) {
      formData.append('image', img)
    }

    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
      formData,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }
    )
  }

  const { isPending, mutate } = useMutation({

    mutationFn: updateComment,

    onSuccess: (data) => {

      toast.success(data.data.message)

      queryClient.invalidateQueries({
        queryKey: ['comments', postId]
      })

      queryClient.invalidateQueries({
        queryKey: ['Posts']
      })

      queryClient.invalidateQueries({
        queryKey: ['UserPost']
      })

      onClose()
    },

    onError: (error: any) => {

      toast.error(
        error.response?.data?.message || 'Something went wrong'
      )
    }
  })

  function handleImg() {

    const file = commentImage.current?.files?.[0]

    if (file) {

      const url = URL.createObjectURL(file)

      setImgSrc(url)
      setImg(file)
    }
  }

  function closeImg() {

    setImgSrc(null)
    setImg(null)

    if (commentImage.current) {
      commentImage.current.value = ''
    }
  }

  return (

    <div className="bg-blue-100 my-4 p-4">

      <TextArea
        ref={commentContent}
        rows={3}
        fullWidth={true}
        defaultValue={comment.content}
        placeholder="enter your comment"
      />

      {imgSrc ? (

        <div className="my-4">

          <i
            onClick={closeImg}
            className="fa-solid fa-xmark cursor-pointer"
          ></i>

          <img
            src={imgSrc}
            className="w-1/2"
            alt=""
          />

        </div>

      ) : (

        <input
          onChange={handleImg}
          ref={commentImage}
          type="file"
          className="my-4"
        />

      )}

      <div className="flex gap-3">

        <Button
          onClick={() => mutate()}
          disabled={isPending}
          variant="primary"
        >
          {isPending ? (
            <i className="fa-solid fa-spinner fa-spin"></i>
          ) : (
            'Update'
          )}
        </Button>

        <Button
          onClick={onClose}
          disabled={isPending}
          variant="secondary"
        >
          Cancel
        </Button>

      </div>

    </div>
  )
}

export default UpdateComment