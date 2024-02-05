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

  const [isCorrect, setIsCorrect] = React.useState(false);

  console.log(isCorrect);

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

      {/* <div className="form-control">
        <label className="cursor-pointer label">
          <span className="label-text">ถูก✅</span>

          <Controller
            name="isCorrect"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                {...field}
                className="checkbox checkbox-success"
                value={isCorrect === true ? true : false}
                onChange={(e) => {
                  setIsCorrect(e.target.checked);
                  
                }}
              />
            )}
          />
        </label>
      </div>
      
      <div className="form-control">
        <label className="cursor-pointer label">
          <span className="label-text">ผิด❌</span>

          <Controller
            name="isCorrect"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                {...field}
                className="checkbox checkbox-error"
                value={isCorrect === false ? false : true}
                onChange={(e) => {
                  setIsCorrect(e.target.checked);
                  field.onChange(e);
                }}
              />
            )}
          />
        </label>
      </div> */}

      <div className="form-control">
        <label className="cursor-pointer label">
          <Controller
            name="isCorrect"
            control={control}
            render={({ field }) => (
              <div className="space-x-10">
                <label>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-success"
                    {...field}
                    value={isCorrect}
                    checked={isCorrect ? true : false}
                    onChange={(e) => {
                      setIsCorrect(e.target.checked);
                      field.onChange(e);
                    }}
                  />
                  <span className="label-text">ถูก✅</span>
                </label>

                <label>
                  <input
                    type="checkbox"
                    {...field}
                    value={isCorrect}
                    className="checkbox checkbox-error"
                    checked={isCorrect ? false : true}
                    onChange={(e) => {
                      setIsCorrect(e.target.checked);
                      field.onChange(e);
                    }}
                  />
                  <span className="label-text">ผิด❌</span>
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
