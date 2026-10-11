import { TextArea, Button, toast } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useRef, useState } from 'react'
import type { Post } from '../../Interfaces/PostInterface'

const UpdatePost = ({
  post,
  onClose
}: {
  post: Post
  onClose: () => void
}) => {

  const queryClient = useQueryClient()

  const [imgSrc, setImgSrc] = useState(post?.image || null)
  const [img, setImg] = useState<File | null>(null)

  const postBody = useRef<HTMLTextAreaElement>(null)
  const postImage = useRef<HTMLInputElement>(null)

  function updatePost() {

    const formData = new FormData()

    if (postBody.current?.value) {
      formData.append('body', postBody.current.value)
    }

    if (img) {
      formData.append('image', img)
    }

    return axios.put(
      `https://route-posts.routemisr.com/posts/${post._id}`,
      formData,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }
    )
  }

  const { isPending, mutate } = useMutation({

    mutationFn: updatePost,

    onSuccess: (data) => {

      toast.success(data.data.message)

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

    const file = postImage.current?.files?.[0]

    if (file) {

      const url = URL.createObjectURL(file)

      setImgSrc(url)
      setImg(file)

    }
  }

  function closeImg() {

    setImgSrc(null)
    setImg(null)

    if (postImage.current) {
      postImage.current.value = ''
    }
  }

  return (

    <div className="bg-blue-100 w-full mx-auto md:w-3/4 my-5 p-5">

      <TextArea
        ref={postBody}
        rows={4}
        fullWidth={true}
        defaultValue={post?.body}
        placeholder="enter your post body"
      />

      {imgSrc ? (

        <div className="my-5">

          <i
            onClick={closeImg}
            className="fa-solid fa-xmark cursor-pointer"
          ></i>

          <img
            src={imgSrc}
            className="w-full"
            alt=""
          />

        </div>

      ) : (

        <div className="flex my-5 items-center justify-center w-full">

          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium"
          >

            <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">

              <i className="fa-solid fa-cloud-arrow-up text-3xl mb-4"></i>

              <p className="mb-2 text-sm">
                <span className="font-semibold">
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>

              <p className="text-xs">
                SVG, PNG, JPG or GIF
              </p>

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

      <div className="flex gap-3">

        <Button
          onClick={() => mutate()}
          disabled={isPending}
          variant="primary"
        >
          {isPending ? (
            <i className="fa-solid fa-spinner fa-spin"></i>
          ) : (
            'Update Post'
          )}
        </Button>

        <Button
          onClick={onClose}
          variant="secondary"
          disabled={isPending}
        >
          Cancel
        </Button>

      </div>

    </div>
  )
}

export default UpdatePost
