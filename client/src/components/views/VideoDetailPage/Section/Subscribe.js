import React, { useEffect, useState } from "react";
import axios from "axios";

const Subscribe = (props) => {
  const [subscribeNumber, setSubscribeNumber] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  useEffect(() => {
    let data = { userTo: props.userTo };
    axios.post("/api/subscribe/subscribeNumber", data).then((res) => {
      if (res.data.success) {
        setSubscribeNumber(res.data.subscribeNumber);
      } else {
        alert("구독자 수 정보를 가져오지 못했습니다.");
      }
    });
    let subscribedData = {
      userTo: props.userTom,
      userFrom: props.userFrom,
    };
    axios.post("/api/subscribe/subscribed", subscribedData).then((res) => {
      if (res.data.success) {
        setSubscribed(res.data.subscribed);
      } else {
        alert("정보를 받아오지 못했습니다.");
      }
    });
  }, []);
  const onSubscribe = () => {
    let data = {
      userTo: props.userTom,
      userFrom: props.userFrom,
    };

    // 구독 중인 경우
    if (subscribed) {
      axios.post("/api/subscribe/unSubscribe", data).then((res) => {
        if (res.data.success) {
          setSubscribeNumber(subscribeNumber - 1);
          setSubscribed(!subscribed);
        } else {
          alert("구독 취소하는데 실패했습니다.");
        }
      });

      //구독하지 않고 있을 경우
    } else {
      axios.post("/api/subscribe/subscribe", data).then((res) => {
        if (res.data.success) {
          setSubscribeNumber(subscribeNumber + 1);
          setSubscribed(!subscribed);
        } else {
          alert("구독하는데 실패했습니다.");
        }
      });
    }
  };

  return (
    <div>
      <button
        style={{
          backgroundColor: `${subscribed ? "#AAAAAA" : "#CC0000"}`,
          borderRadius: "4px",
          color: "white",
          padding: "10px 16px",
          fontWeight: "500",
          fontSize: "1rem",
          textTransform: "uppercase",
        }}
        onClick={onSubscribe}
      >
        {subscribeNumber} {subscribed ? "구독 중" : "구독 하기"}
      </button>
    </div>
  );
};

export default Subscribe;