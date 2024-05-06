import * as React from "react";
import { Input } from "@/components/ui/input";
import CardEventPromo from "../../_components/home/card-event-promo";
import axios from "axios";
import { NEXT_PUBLIC_BASE_API_URL } from "@/lib/env";

interface IMainDescriptionProps {}

const MainDescription: React.FunctionComponent<IMainDescriptionProps> = (props) => {
  const [event, setEvent] = React.useState<any>([]);
  const [eventId, setRventId] = React.useState<string>(
    window.location.href.split("/")[4],
  );
  React.useEffect(() => {
    getApiDetail();
  }, [eventId]);
  //Handle Get API Detail :
  const getApiDetail = async () => {
    try {
      let url = NEXT_PUBLIC_BASE_API_URL + `/events/${eventId}`;
      const response = await axios.get(url);
      console.log(response.data.result[0]);
      setEvent(response.data.result[0]);
    } catch (err) {
      console.log("Error fetching event data:", err);
    }
  };
  return (
    <section>
      <div className="mx-[0px] h-[300] w-full rounded-lg bg-white p-[20px] md:mx-[120px] md:mt-[10px] md:w-[784px]  md:px-[28px] md:py-[28px]">
        <div className=" ">
          <h1 className="text-[18px]  font-semibold ">Deskripsi</h1>
          <p className="mt-[12px] text-justify text-[14px] md:mt-[10px] md:text-[14px]">
            {event.description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default MainDescription;
