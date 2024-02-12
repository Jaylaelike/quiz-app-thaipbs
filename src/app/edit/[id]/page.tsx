'use client';

import FormPost from '@/app/components/FormPost';
import { FormInputPost } from '@/app/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { FC } from 'react'
import { SubmitHandler } from 'react-hook-form';

interface EditPostPageProps {
  params: {
    id: string;
  };
}


  const EditPostPage: FC<EditPostPageProps> = ({ params }) => {

    const router = useRouter();
    const { id } = params;
    const {
      data: dataPost,
      isLoading: isLoadingPost,
      isError,
      error,
    } = useQuery({
      queryKey: ["posts", id],
      queryFn: async () => {
        const res = await axios.get(`/api/questions/${id}`);
        return res.data;
      }
    });

    //console.log(dataPost);
    
    const {mutate: updatePost, isPending} = useMutation({
      mutationFn: (  newPost : FormInputPost) =>{
        return axios.patch(`/api/questions/${id}`, newPost);
      },
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data) => {
        console.log(data);
        router.push('/');
        router.refresh();
      },
    })

 




    const handleEditPost: SubmitHandler<FormInputPost> = async (data) => {
       updatePost(data);
        
      };


    if (isLoadingPost) {
      return <span className="loading loading-lg"></span>;
    }
      return (
        <div>
          <h1 className='text-2xl my-4 font-bold text-center'>Edit Post</h1>
          <FormPost submit={handleEditPost} initalValue={dataPost} isEditing/>
   
        </div>
      )
    }


export default EditPostPage
