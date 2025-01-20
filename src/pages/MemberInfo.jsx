import React, { useState } from "react";
import style from "./MemberInfo.module.css";

function MemberInfo() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("010-1234-5678");
  const [emailPrefix, setEmailPrefix] = useState("test123");
  const [emailDomain, setEmailDomain] = useState("email.com");
  const [smsReceive, setSmsReceive] = useState(true);
  const [emailReceive, setEmailReceive] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handlePasswordCheck = () => {
    setIsConfirmed(true);
  };

  const handleSmsReceiveChange = (value) => {
    setSmsReceive(value);
  };

  const handleEmailReceiveChange = (value) => {
    setEmailReceive(value);
  };

  return (
    <div className={style.member_info_container}>
      <div className={style.main_content}>
        <h1 className={style.member_info_title}>회원정보 확인 · 수정</h1>

        <div className={style.member_info_content}>
          {/* 기본 정보 */}
          <div className={style.member_info_section}>
            <h2 className={style.section_title}>기본 정보</h2>
            <div className={style.info_item}>
              <label>이름</label>
              <span>홍길동</span>
            </div>
            <div className={style.info_item}>
              <label>아이디</label>
              <span>test123@email.com</span>
            </div>
            <div className={style.info_item}>
              <label>현재 비밀번호</label>
              <div className={style.password_input_container}>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isConfirmed}
                />
                <button
                  onClick={handlePasswordCheck}
                  disabled={isConfirmed}
                  className={style.confirm_button}
                >
                  확인
                </button>
              </div>
            </div>
            <div className={style.info_item}>
              <label>변경 비밀번호</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
              <p className={style.password_guideline}>
                * 영문 (대소문자)/숫자/특수문자 중 2가지 이상 조합, 10자~16자
              </p>
            <div className={style.info_item}>
              <label>비밀번호 확인</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
<hr />
          {/* 부가 정보 */}
          <div className={style.member_info_section}>
            <h2 className={style.section_title}>부가 정보</h2>
            <div className={style.info_item}>
              <label>휴대폰 번호</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className={style.info_item_email}>
              <label>이메일</label>
              <input
                type="text"
                value={emailPrefix}
                onChange={(e) => setEmailPrefix(e.target.value)}
              />
              <span style={{ padding: "0 5px" }}>@</span>
              <input
                type="text"
                value={emailDomain}
                onChange={(e) => setEmailDomain(e.target.value)}
              />
            </div>
            <div className={style.info_item}>
              <label>SMS 수신</label>
              <div className={style.radio_group}>
                <input
                  type="radio"
                  id="sms_receive"
                  name="sms_receive"
                  checked={smsReceive}
                  onChange={() => handleSmsReceiveChange(true)}
                />
                <label htmlFor="sms_receive">수신함</label>

                <input
                  type="radio"
                  id="sms_reject"
                  name="sms_receive"
                  checked={!smsReceive}
                  onChange={() => handleSmsReceiveChange(false)}
                />
                <label htmlFor="sms_reject">수신 안 함</label>
              </div>
              <span className={style.subtext}>
                * 코카키리에서 제공되는 소식을 SMS로 받으실 수 있습니다.
              </span>
            </div>
            <div className={style.info_item}>
              <label>이메일 수신</label>
              <div className={style.radio_group}>
                <input
                  type="radio"
                  id="email_receive"
                  name="email_receive"
                  checked={emailReceive}
                  onChange={() => handleEmailReceiveChange(true)}
                />
                <label htmlFor="email_receive">수신함</label>
                <input
                  type="radio"
                  id="email_reject"
                  name="email_receive"
                  checked={!emailReceive}
                  onChange={() => handleEmailReceiveChange(false)}
                />
                <label htmlFor="email_reject">수신 안 함</label>
              </div>
              <span className={style.subtext}>
                * 코카키리에서 제공되는 소식을 이메일로 받으실 수 있습니다.
              </span>
            </div>
          </div>

          {/* 버튼 */}
          <div className={style.button_group}>
            <button className={style.confirm_button}>확인</button>
            <button className={style.cancel_button}>취소</button>
          </div>
        </div>
      </div>
        <div className={style.member_info_sidebar}>
        <h2 className={style.sidebar_title}>회원정보 확인 · 수정</h2>
        <ul className={style.sidebar_menu}>
          <li>회원정보 확인 · 수정</li>
          <li>쿠폰 · 스탬프 조회</li>
          <li>주문내역 조회</li>
          <li>1:1 문의 내역</li>
        </ul>
      </div>
    </div>
  );
}

export default MemberInfo;