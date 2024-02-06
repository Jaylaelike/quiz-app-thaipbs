"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";

interface ButtonActionProps {
  id: string;
}

function ButtonUserAction({ id }: ButtonActionProps) {
  return (
    <div>
      <Link href={`/usersendanswer/${id}`} className="btn mr-2">
        <PlusCircle /> ส่งคำตอบ
      </Link>
    </div>
  );
}

export default ButtonUserAction;
