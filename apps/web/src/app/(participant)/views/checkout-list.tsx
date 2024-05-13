"use client";
import * as React from "react";
import axios from "axios";
import { NEXT_PUBLIC_BASE_API_URL } from "@/lib/env";
import CardEventMyList from "../_components/card-event-my-list";
import CardCheckout from "../_components/card-checkout";
import { getUserProfile } from "@/data/user";
import Cookies from "js-cookie";

interface IMyChecoutListProps {}

const MyChecoutList: React.FunctionComponent<IMyChecoutListProps> = (props) => {
  const [event, setEvent] = React.useState([]);
  const [dataProfile, setDataProfile] = React.useState<any[]>([]);
  React.useEffect(() => {
    onHandleGet();
  }, []);
  const onHandleGet = async () => {
    try {
      const UserProfile = await getUserProfile(Cookies.get("user-tkn")!);
      setDataProfile(UserProfile.result);
      console.log(UserProfile.result);

      const config = {
        headers: { Authorization: `Bearer ${Cookies.get("user-tkn")}` },
      };
      // route ini nanti diganti sesuai event? id pengggna, status
      let url = NEXT_PUBLIC_BASE_API_URL + `/transactions/waiting`;
      const response = await axios.get(url, config);
      setEvent(response.data.result.eventsWaiting);
      console.log(response.data.result.eventsWaiting);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section>
      <div className="mx-10 my-[18px] md:grid md:grid-cols-4 md:gap-4 md:p-6">
        {event.map((event: any, index: number) => (
          <div key={index}>
            <CardCheckout
              id={event.event.id}
              judul={event.event.name}
              lokasi={event.event.locationId}
              waktu={event.event.createdAt}
              harga={event.event.price}
              urlImage={NEXT_PUBLIC_BASE_API_URL + event.event.imageURL}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MyChecoutList;
