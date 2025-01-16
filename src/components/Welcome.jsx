import { useEffect, useRef } from "react";
import style from "./Welcome.module.css";
import Notice from "./Notice";

const Welcome = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("비디오 재생 실패:", error);
      });
    }
  }, []);

  return (
    <div className={`${style.Welcome}`}>
      <video ref={videoRef} autoPlay muted loop className={`${style.video}`}>
        <source src="/video/backgroud-video.mp4" type="video/mp4" />
        브라우저가 비디오 태그를 지원하지 않습니다.
      </video>
      <Notice />
    </div>
  );
};

export default Welcome;
