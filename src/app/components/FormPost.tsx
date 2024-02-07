"use client";
import React, { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInputPost } from "../types";
import { useAuth } from "@clerk/nextjs";

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
  const { register, handleSubmit } = useForm<FormInputPost>({
    defaultValues: initalValue,
  });

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
      onSubmit={handleSubmit(submit)}
      className="flex flex-col items-center justify-center gap-5 mt-10"
    >
      {/* <input
        {...register("", { required: true })}
        type="text"
        placeholder="Post Title ..."
        className="input input-bordered w-full max-w-lg"
      /> */}

    
      <input
        {...register("userId", { required: true })}
        type="hidden"
        placeholder="Post Title ..."
        className="input input-bordered w-full max-w-lg"
        value={userId || ""}
      />
        

      <textarea
        {...register("content", { required: true })}
        className="textarea textarea-bordered w-full max-w-lg"
        placeholder="สร้างคำถามของคุณที่นี่..."
      ></textarea>

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

      <select
        {...register("status", { required: true })}
        className="select select-bordered w-full max-w-lg"
        defaultValue=""
      >
        <option disabled value="">
          เลือกสถานะของคำถาม
        </option>

        <option value="draft">draft</option>
        <option value="production">production</option>
      </select>

      <button type="submit" className="btn btn-primary w-full max-w-lg">
        {isEditing ? "Edit" : "Create"}
      </button>
    </form>
  );
};

export default FormPost;
