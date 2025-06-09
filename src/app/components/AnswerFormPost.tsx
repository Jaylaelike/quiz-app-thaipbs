"use client";
import React, { FC } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { FormInputAnswer } from "../types";
import { useAuth } from "@clerk/nextjs";

// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { Tag } from "@prisma/client";
interface FormAnswerProps {
  submit: SubmitHandler<FormInputAnswer>;
  isEditing: boolean;
  initalValue?: FormInputAnswer;
  questionId?: string;
}
const AnswerFormPost: FC<FormAnswerProps> = ({
  submit,
  isEditing,
  initalValue,
  questionId,
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { register, handleSubmit, control } = useForm<FormInputAnswer>({
    defaultValues: initalValue,
  });

  // Removed redundant isCorrect state as it's managed by react-hook-form

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
      <input
        {...register("userId", { required: true })}
        type="hidden"
        placeholder="Post Title ..."
        className="input input-bordered w-full max-w-lg"
        value={userId || ""}
      />

      <input
        {...register("content", { required: true })}
        type="text"
        placeholder="คำตอบของคุณที่นี่.."
        className="input input-bordered w-full max-w-lg"
      />

      <input
        {...register("questionId", { required: true })}
        type="text"
        placeholder="questionId ..."
        className="input input-bordered w-full max-w-lg"
        value={questionId}
      />


      <div className="form-control">
        <label className="cursor-pointer label">
          <Controller
            name="isCorrect"
            control={control}
            defaultValue={false}
            render={({ field: { value, onChange } }) => (
              <div className="space-x-10">
                <label className="cursor-pointer label">
                  <input
                    type="radio"
                    className="radio radio-success"
                    checked={value === true}
                    onChange={() => onChange(true)}
                  />
                  <span className="label-text ml-2">ถูก✅</span>
                </label>
                <label className="cursor-pointer label">
                  <input
                    type="radio"
                    className="radio radio-error"
                    checked={value === false}
                    onChange={() => onChange(false)}
                  />
                  <span className="label-text ml-2">ผิด❌</span>
                </label>
              </div>
            )}
          />
        </label>
      </div>



      <button type="submit" className="btn btn-warning w-full max-w-lg">
        {isEditing ? "Edit" : "Create"}
      </button>
    </form>
  );
};

export default AnswerFormPost;
