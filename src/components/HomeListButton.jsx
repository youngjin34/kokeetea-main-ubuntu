const PageButton = ({ text, currentPage, pageIndex, onClick }) => {
  return (
    <div
      onClick={() => onClick(pageIndex)}
      style={{
        cursor: 'pointer',
        padding: '5px 10px',
        margin: '5px 0',
        color: currentPage === pageIndex + 1 ? '#ba274a' : 'gray',
        fontSize: currentPage === pageIndex + 1 ? '24px' : '18px',
        transition: 'all 0.3s',
        textAlign: 'center',
      }}
    >
      {text}
    </div>
  );
};
const HomeListButton = ({ currentPage, scrollToSection }) => {
  const buttonLabels = ['Welcome', 'Menu', 'About Us', 'Franchise'];

  return (
    <div
      style={{
        position: 'fixed',
        top: '70%',
        left: 100,
        transform: 'translateY(-50%)',
        zIndex: 999,
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
            currentPage={currentPage + 1}
            onClick={scrollToSection}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeListButton;
