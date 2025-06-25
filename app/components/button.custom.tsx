interface Props {
  text?: string;
  onClick?: () => void;
  disable?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  color?: string;
}

export const ButtonCustom = (props: Props) => {
  const {
    text = 'Aceptar',
    onClick,
    disable = false,
    type = 'button',
    className = '',
    color = 'bg-primary',
  } = props;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disable}
      className={`
        py-2 px-4 font-semibold transition rounded-xl
        ${disable ? 'bg-gray-400 cursor-not-allowed' : `${color} cursor-pointer text-white`}
        ${className}
      `}
    >
      {text}
    </button>
  );
};