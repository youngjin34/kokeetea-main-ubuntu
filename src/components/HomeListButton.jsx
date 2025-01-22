const PageButton = ({ text, currentPage, pageIndex, onClick }) => {
  return (
    <div
      onClick={() => onClick(pageIndex)}
      style={{
        cursor: "pointer",
        padding: "8px 15px",
        margin: "8px 0",
        color: currentPage === pageIndex + 1 ? "#ba274a" : "#888",
        fontSize: currentPage === pageIndex + 1 ? "24px" : "18px",
        fontFamily: "Pretendard-Regular",
        transition: "all 0.4s ease",
        textAlign: "left",
        position: "relative",
        fontWeight: currentPage === pageIndex + 1 ? "600" : "400",
        transform: currentPage === pageIndex + 1 ? "translateX(10px)" : "translateX(0)",
        opacity: currentPage === pageIndex + 1 ? "1" : "0.7",
        width: "120px",
        ":hover": {
          color: "#ba274a",
          transform: "translateX(10px)",
          opacity: "1",
        },
      }}
    >
      {text}
      {currentPage === pageIndex + 1 && (
        <span
          style={{
            position: "absolute",
            left: "-20px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "8px",
            height: "8px",
            backgroundColor: "#ba274a",
            borderRadius: "50%",
          }}
        />
      )}
    </div>
  );
};

const HomeListButton = ({ currentPage, scrollToSection }) => {
  const buttonLabels = ["Welcome", "Menu", "About Us", "Franchise"];

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: 80,
        transform: "translateY(-50%)",
        zIndex: 9,
        padding: "15px 10px",
        borderRadius: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {buttonLabels.map((label, index) => (
          <PageButton
            key={index}
            text={label}
            pageIndex={index}
            currentPage={currentPage + 1}
            onClick={scrollToSection}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeListButton;
