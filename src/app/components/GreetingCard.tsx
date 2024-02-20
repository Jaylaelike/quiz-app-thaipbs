"use client";
import React, { useEffect } from "react";

interface UserNameProps {
  username: string | null;
  fisrtLogin: boolean | null;
}

function GreetingCard({ username, fisrtLogin }: UserNameProps) {
  useEffect(() => {
    const modal = document.getElementById("my_modal_4") as HTMLDialogElement;
    modal?.showModal();
  }, []);

  return (
    <div>
      {fisrtLogin ? (
        <>
          <dialog id="my_modal_4" className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
              <h3 className="font-bold text-lg">🎉 สวัสดีค่ะ!</h3>
              <p className="py-4">ยินดีต้อนรับคุณ {username}</p>
              <p className="py-4">🩵 ยินดีด้วย 🩵</p>
              {/* <p className="py-4">🏆 โปรโมชั่นเข้าใช้งานครั้งแรกรับไปเลย 50 คะแนน 🏆</p> */}
              <p className="py-4">คุณได้เป็นสมาชิกเข้าร่วมชิงรางวัลแล้ว 🏆</p>
              <div className="modal-action">
                
                <form method="dialog">
                  {/* if there is a button, it will close the modal */}
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </>
      ) : (
        <dialog id="my_modal_4" className="modal">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="font-bold text-lg">🎉 สวัสดีค่ะ!</h3>
            <p className="py-4">ยินดีต้อนรับกลับมาอีกครั้งคุณ {username}</p>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default GreetingCard;
