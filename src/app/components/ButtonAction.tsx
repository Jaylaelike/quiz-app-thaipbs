"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PenSquare, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusCircle } from 'lucide-react';

interface ButtonActionProps {
  id: string;
}



function ButtonAction({ id }: ButtonActionProps) {
  const router = useRouter();
  const { mutate: deletePost, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      return axios.delete(`/api/posts/${id}`);
    },
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      console.log("error");
    },
  });



  return (
    <div>
      <Link href={`/edit/${id}`} className="btn mr-2">
        <PenSquare /> แก้ไข
      </Link>

      <Link href={`/createanswer/${id}`} className="btn mr-2">
        <PlusCircle /> เพิ่มคำตอบ
      </Link>
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

export default ButtonAction;
