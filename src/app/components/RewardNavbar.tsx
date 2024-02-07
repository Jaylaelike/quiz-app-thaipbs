import React from "react";
import { Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface UserIdProps {
  id: string;
}

function RewardNavbar({ id }: UserIdProps) {
  const { data } = useQuery({
    queryKey: ["rewards", id],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    queryFn: async () => {
      const res = await axios.get(`/api/users/${id}`);
      console.log(res.data?.Rewards[0].points);

      return res.data;
    },
  });

 

  return (
    <div>
      <div className="navbar bg-neutral ">
        <div className="container space-x-3">
          <div className="flex-1">
            <Trophy size={32} />
          </div>

          <div className="flex-1 ">
            <h4 className="text-base ">{data?.Rewards[0].points}</h4>
          </div>

          <div className="flex-1">
            <h4 className="text-base ">Points</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RewardNavbar;
