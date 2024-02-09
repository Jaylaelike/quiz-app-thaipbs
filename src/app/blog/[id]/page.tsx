import BackButton from "@/app/components/BackButton";
import ButtonAction from "@/app/components/ButtonAction";
import db from "@/app/lib/db";
import React, { FC } from "react";
import dayjs from "dayjs";
import { auth, currentUser } from "@clerk/nextjs";
import ButtonUserAction from "@/app/components/ButtonUserAction";

interface BlogDetailPageProps {
  params: {
    id: string;
    content: string;
  };
}

async function getPost(id: string) {
  const res = await db.question.findFirst({
    where: {
      id: id,
    },
    select: {
      content: true,
      status: true,
      createdAt: true,
      user: true,
    },
  });
  return res;
}

//filter answer by userId and questionId
async function getAnswers(questionId: string, userId: string) {
  const res = await db.answer.findMany({
    where: {
      questionId: questionId,
      userId: userId,
    },
    select: {
      content: true,
      isCorrect: true,
      createdAt: true,
    },
  });
  return res;
}

//get answers in questionId from userId is have answer or not
async function getAnswerByUserId(userId: string, questionId: string) {
  const res = await db.answer.findFirst({
    where: {
      userId: userId,
      questionId: questionId,
    },
  });
  return res;
}

//get all answers in questionId
async function getAnswerAlluser(questionId: string) {
  const res = await db.answer.findMany({
    where: {
      questionId: questionId,
      NOT: {
        userId: "user_2Y4Ookbfem91BKQT1RNiSdWA3Gc",
      } || {
        userId: "user_2c7o0iubxsGtok6I7IyJNPqMqrq",
      },
    },
  });
  return res;
}

//get user all filter not "Sittichai"
async function getUserAll() {
  const res = await db.user.findMany();
  return res;
}

// eslint-disable-next-line @next/next/no-async-client-component
const BlogDetailPage: FC<BlogDetailPageProps> = async ({ params }) => {
  const { userId } = auth();
  const user = await currentUser();

  const post = await getPost(params.id);
  const answers = await getAnswers(params.id, userId);

  //check answer have or not  by userId
  const answerByUserId = await getAnswerByUserId(userId, params.id);
  // console.log(answerByUserId);

  const answerAlluser = await getAnswerAlluser(params.id);
  // console.log(answerAlluser);

  const userAll = await getUserAll();
  // console.log(userAll);

  return (
    <div>
      <BackButton />
      <div className="mb-8">
        {user?.emailAddresses[0].emailAddress === "smarkwisai@gmail.com" && "whea_k@hotmail.com" ? (
          <>
            <h3>ผลเฉลยคำตอบ</h3>

            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>คำตอบ</th>
                  <th>เฉลย</th>
                  <th>อัพเดท</th>
                </tr>
              </thead>
              {/* body */}
              <tbody>
                {answers.map((answer) => (
                  <tr key={answer.id}>
                    <td>{answer.content}</td>
                    <td>{answer.isCorrect ? "ถูก ✅" : "ผิด ❌"}</td>
                    <td>{dayjs(answer.createdAt).format("DD/MM/YYYY")}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>คำตอบจากผู้ท้าชิง</h3>

            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>ผู้ตอบ</th>
                  <th>คำตอบ</th>
                  <th>เฉลย</th>
                  <th>อัพเดท</th>
                </tr>
              </thead>
              {/* body */}
              <tbody>
                {answerAlluser.map((answer) => (
                  <tr key={answer.id}>
                    <td>
                      {userAll.map((user) =>
                        user.id === answer.userId ? user.username : null
                      )}
                    </td>

                    <td>{answer.content}</td>
                    {answer.isCorrect ? <td>ถูก ✅</td> : <td>ผิด ❌</td>}
                    <td>{dayjs(answer.createdAt).format("DD/MM/YYYY")}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ButtonAction id={params.id} />
          </>
        ) : !answerByUserId &&
          user?.emailAddresses[0].emailAddress !== "smarkwisai@gmail.com" && "whea_k@hotmail.com" ? (
          <>
            <div className="flex flex-col items-center justify-center w-full space-y-6">
              <h2 className="text-2xl font-bold my-4">{post?.content}</h2>
              <p>โดย: {post?.user?.username}</p>
              <p>ตอบคำถามถูกรับ 10 คะแนน</p>
              <p>ตอบคำถามผิดได้ 5 คะแนน</p>
              <ButtonUserAction id={params.id} />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center w-full space-y-6">
              <h1>คุณไม่สามารถตอบคำถามนี้ได้ เนื่องจากคุณได้ตอบไปแล้ว !!!</h1>
              <img
                src="https://res.cloudinary.com/satjay/image/upload/v1707374169/vojq1d1bzrnk0fhgexgz.png"
                alt="oops_react"
                height={200}
                width={200}
              />
            </div>
          </>
        )}
      </div>

      <span className="badge badge-accent">{post?.status}</span>
    </div>
  );
};

export default BlogDetailPage;
