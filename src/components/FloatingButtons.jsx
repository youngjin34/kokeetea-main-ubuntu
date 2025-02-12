import { useEffect } from "react";
import style from "./FloatingButtons.module.css";

const FloatingButtons = ({ setCurrentPage }) => {
  // 홈으로 이동하는 함수
  const handleLogoClick = () => {
    if (window.location.pathname === "/") {
      // 현재 홈페이지에 있을 경우 첫 번째 섹션으로 스크롤
      const homeComponent = document.getElementById("section-0");
      if (homeComponent) {
        homeComponent.scrollIntoView({ behavior: "smooth" });
        setCurrentPage(0);
      }
    } else {
      // 다른 페이지에서는 홈으로 이동하면서 state 전달
      window.location.href = "/";
    }
  };

  useEffect(() => {
    // Channel.io 초기화
    (function () {
      let w = window;
      if (w.ChannelIO) {
        return w.console.error("ChannelIO script included twice.");
      }
      let ch = function () {
        ch.c(arguments);
      };
      ch.q = [];
      ch.c = function (args) {
        ch.q.push(args);
      };
      w.ChannelIO = ch;
      function l() {
        if (w.ChannelIOInitialized) {
          return;
        }
        w.ChannelIOInitialized = true;
        let s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://cdn.channel.io/plugin/ch-plugin-web.js";
        let x = document.getElementsByTagName("script")[0];
        if (x.parentNode) {
          x.parentNode.insertBefore(s, x);
        }
      }
      if (document.readyState === "complete") {
        l();
      } else {
        w.addEventListener("DOMContentLoaded", l);
        w.addEventListener("load", l);
      }
    })();

    // Channel.io 부트스트랩
    window.ChannelIO("boot", {
      pluginKey: "aaaa85a2-e4d3-43d3-bddb-5983cca2e006",
      memberId: "customer",
      profile: {
        name: "customer",
        mobileNumber: "010-8891-3006",
        landlineNumber: "010-8891-3006",
        CUSTOM_VALUE_1: "VALUE_1",
        CUSTOM_VALUE_2: "VALUE_2",
      },
    });

    // 컴포넌트 언마운트 시 cleanup
    return () => {
      if (window.ChannelIO) {
        window.ChannelIO("shutdown");
      }
    };
  }, []);

  return (
    <div className={style.floatingContainer}>
      <button
        className={`${style.floatingButton} ${style.topButton}`}
        onClick={handleLogoClick}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/3272/3272638.png"
          alt="위로 가기"
        />
      </button>
    </div>
  );
};

export default FloatingButtons;
