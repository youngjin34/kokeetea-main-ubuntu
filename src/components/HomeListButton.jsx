const PageButton = ({ text, currentPage, pageIndex, onClick }) => {
  return (
    <div
      onClick={() => onClick(pageIndex)}
      style={{
        cursor: 'pointer',
        padding: '5px 10px',
        margin: '5px 0',
        color: currentPage === pageIndex ? 'white' : 'black',
        backgroundColor: currentPage === pageIndex ? 'black' : 'transparent',
        border: '1px solid black',
        borderRadius: 5,
        transition: 'all 0.3s',
        textAlign: 'center',
      }}
    >
      {text}
    </div>
  );
};

const HomeListButton = ({ currentPage }) => {
  const buttonLabels = ['Welcome', 'Menu', 'About Us', 'Franchise'];

  const handleAnchorClick = (pageIndex) => {
    const targetSection = document.getElementById(`section-${pageIndex}`);
    const DIVIDER_HEIGHT = 5;

    if (targetSection) {
      const yOffset = pageIndex * DIVIDER_HEIGHT;
      const yPosition = targetSection.offsetTop + yOffset;

      window.scrollTo({
        top: yPosition,
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        right: 100,
        transform: 'translateY(-50%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {buttonLabels.map((label, index) => (
          <PageButton
            key={index}
            text={label}
            pageIndex={index}
            currentPage={currentPage}
            onClick={handleAnchorClick}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeListButton;
