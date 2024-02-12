"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PenSquare, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";


interface ButtonDeleteAnswerProps {
  id: string;
}

function ButtonDeleteAns({ id }: ButtonDeleteAnswerProps) {
  // console.log(id);

  //delect answer by answerId
  const router = useRouter();
  const { mutate: deletePost, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`/api/answers/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      });
      return res.data;
    },
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      console.log(error.stack);

      console.log("error");
    },
  });

  return (
    <div>
   
      <button onClick={() => deletePost()} className="btn btn-error">
        {isLoading && (
          <span className="loading loading-spinner loading-lg"></span>
        )}

        {isLoading ? (
          "Loading..."
        ) : (
          <>
            <Trash2 /> ลบ
          </>
        )}
      </button>
    </div>
  );
}

export default ButtonDeleteAns;


