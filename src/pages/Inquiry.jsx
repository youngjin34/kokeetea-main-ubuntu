import React, { useState, useEffect } from "react";
import style from "./Inquiry.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Inquiry = () => {
  // 페이지 들어왔들 때 제일 위로 이동하게 하는 코드
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: "문의",
    name: "",
    phone: "",
    emailId: "",
    emailDomain: "",
    title: "",
    content: "",
  });

  const emailDomains = [
    { value: "", label: "직접입력" },
    { value: "naver.com", label: "naver.com" },
    { value: "gmail.com", label: "gmail.com" },
    { value: "daum.net", label: "daum.net" },
    { value: "hanmail.net", label: "hanmail.net" },
  ];

  useEffect(() => {
    localStorage.setItem("inquiryFormData", JSON.stringify(formData));
  }, [formData]);

  const handleEmailDomainChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      emailDomain: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수 필드 검증
    if (
      !formData.name ||
      !formData.phone ||
      !formData.title ||
      !formData.content ||
      !formData.type
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    const fullEmail =
      formData.emailId && formData.emailDomain
        ? `${formData.emailId}@${formData.emailDomain}`
        : "";

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요한 서비스입니다.");
        return;
      }

      const submitData = {
        category: formData.type,
        title: formData.title,
        text: formData.content,
        date: new Date().toISOString().split("T")[0],
        writerName: formData.name,
        phoneNumber: formData.phone,
        email: fullEmail,
      };

      const response = await axios.post(
        "http://localhost:8080/api/questions",
        submitData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert("문의가 성공적으로 등록되었습니다.");

        setFormData({
          type: "문의",
          name: "",
          phone: "",
          emailId: "",
          emailDomain: "",
          title: "",
          content: "",
        });

        navigate("/inquiryhistory");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        if (error.response.status === 401 || error.response.status === 403) {
          alert("로그인이 필요하거나 권한이 없습니다.");
        } else {
          alert("문의 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
      } else {
        alert("서버와의 통신 중 오류가 발생했습니다.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    const onlyNums = value.replace(/[^0-9]/g, "");
    if (onlyNums.length <= 11) {
      setFormData((prev) => ({
        ...prev,
        phone: onlyNums,
      }));
    }
  };

  return (
    <div className={style.Container}>
      <div className={style.MainContent}>
        <div className={style.menu_title}>
          <span className={style.underline}>1:1 문의하기</span>
        </div>
        <p className={style.menu_content}>
          코키티는 접수해 주신 의견에 대해
          <br />
          신속하게 처리할 수 있도록 최선을 다하겠습니다.
        </p>

        <div className={style.FormContainer}>
          <p className={style.FormContainer_content}>
            ※ 정상업무시간 09:00 ~ 18:00(주말, 공휴일, 국경일 휴무)
          </p>
          <form className={style.Form} onSubmit={handleSubmit}>
            <div className={style.FormGroup}>
              <label>접수 구분</label>
              <div className={style.RadioGroup}>
                {["문의", "칭찬", "불만"].map((type) => (
                  <label key={type} className={style.RadioItem}>
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={formData.type === type}
                      onChange={handleChange}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {["name"].map((field) => (
              <div key={field} className={style.FormGroup}>
                <label>이름</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder="이름을 입력해주세요."
                />
              </div>
            ))}

            <div className={style.FormGroup}>
              <label>연락처</label>
              <div className={style.PhoneInputGroup}>
                <select className={style.PhonePrefix}>
                  <option value="SKT">SKT</option>
                  <option value="KT">KT</option>
                  <option value="LG">LG</option>
                </select>
                <span className={style.PhoneSeparator}></span>
                <input
                  type="text"
                  maxLength="11"
                  className={style.PhoneInput}
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="하이픈(-) 없이 입력해주세요."
                />
              </div>
            </div>

            {["title"].map((field) => (
              <div key={field} className={style.FormGroup}>
                <label>제목</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder="제목을 입력해주세요."
                />
              </div>
            ))}

            <div className={style.FormGroup}>
              <label>이메일</label>
              <div className={style.EmailGroup}>
                <input
                  type="text"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleChange}
                  placeholder="이메일"
                />
                <span className={style.EmailAt}>@</span>
                <input
                  type="text"
                  name="emailDomain"
                  value={formData.emailDomain}
                  onChange={handleChange}
                />
                <select
                  value={formData.emailDomain}
                  onChange={handleEmailDomainChange}
                  className={style.EmailSelect}
                >
                  {emailDomains.map((domain) => (
                    <option key={domain.value} value={domain.value}>
                      {domain.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={style.FormGroup}>
              <label>문의 내용</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="6"
                placeholder="문의 내용을 입력해주세요."
              />
            </div>

            <button type="submit" className={style.SubmitButton}>
              접수하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Inquiry;
