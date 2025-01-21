export const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: "#d1d5db",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#4f46e5",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 10,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#4f46e5"
        : state.isFocused
        ? "#e5e7eb"
        : "white",
      color: state.isSelected ? "white" : "black",
      cursor: "pointer",
    }),
  };
  