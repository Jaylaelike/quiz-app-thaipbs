"use client";
import React, { FC, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInputPost } from "../types";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { Tag } from "@prisma/client";
interface FormPostProps {
  submit: SubmitHandler<FormInputPost>;
  isEditing: boolean;
  initalValue?: FormInputPost;
}
const FormPost: FC<FormPostProps> = ({ submit, isEditing, initalValue }) => {

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { isLoaded, userId, sessionId, getToken } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormInputPost>({
    defaultValues: initalValue,
  });

  const onSubmit: SubmitHandler<FormInputPost> = async (data) => {
    try {
      setIsSubmitting(true);
      await submit(data);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        if (!isEditing) {
          // Reset form after successful submission for new questions
          const form = document.querySelector('form');
          form?.reset();
        }
      }, 2000);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  //fetch list page
  // const { data: dataTags, isLoading: isLoadingTags } = useQuery<Tag[]>({
  //   queryKey: ["tags"],
  //   queryFn: async () => {
  //     const res = await axios.get("/api/tags");
  //     return res.data;
  //   },
  // });

  // console.log(dataTags);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditing ? 'Edit Question' : 'Create New Question'}
      </h2>
      
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
          {isEditing ? 'Question updated successfully!' : 'Question created successfully!'}
        </div>
      )}
      {/* <input
        {...register("", { required: true })}
        type="text"
        placeholder="Post Title ..."
        className="input input-bordered w-full max-w-lg"
      /> */}

    
      <input
        {...register("userId", { required: true })}
        type="hidden"
        value={userId || ""}
      />
      
      <div className="w-full mb-6">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Question Content *
        </label>
        <textarea
          id="content"
          {...register("content", { 
            required: 'Question content is required',
            minLength: { value: 10, message: 'Question must be at least 10 characters long' }
          })}
          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.content ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your question here..."
          rows={4}
          disabled={isSubmitting}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      {/* {isLoadingTags ? (
        <span className="loading loading-ball loading-lg"></span>
      ) : (
        <select
          {...register("tagId", { required: true })}
          className="select select-bordered w-full max-w-lg"
          defaultValue= ""
        >
          <option disabled value="">
            Select tags
          </option>
          {dataTags?.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      )} */}

      <div className="w-full mb-6">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          Status *
        </label>
        <select
          id="status"
          {...register("status", { 
            required: 'Please select a status',
            validate: value => value !== '' || 'Please select a status'
          })}
          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.status ? 'border-red-500' : 'border-gray-300'
          }`}
          defaultValue=""
          disabled={isSubmitting}
        >
          <option value="" disabled>Select status...</option>
          <option value="draft">Draft</option>
          <option value="production">Production</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className={`px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditing ? 'Updating...' : 'Creating...'}
            </span>
          ) : isEditing ? 'Update Question' : 'Create Question'}
        </button>
      </div>
    </form>
  );
};

export default FormPost;
