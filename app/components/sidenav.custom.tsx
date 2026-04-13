import { Link } from 'react-router';
import { cn } from '@/lib/utils';

interface Props {
  title: string;
  icon?: React.ReactNode;
  path?: string;
  active?: boolean;
  onClick?: () => void;
  rightIcon?: React.ReactNode;
}

export const SideNavCustom = ({
  title,
  icon,
  path,
  active = false,
  onClick,
  rightIcon,
}: Props) => {
  const classes = cn(
    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all duration-150 w-full',
    active && path
      ? 'bg-secondary-100 text-secondary font-semibold border-l-[3px] border-secondary pl-[calc(0.75rem-3px)]'
      : active && !path
      ? 'text-secondary font-medium'
      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
  );

  const content = (
    <>
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {icon && (
          <span className={cn('h-4 w-4 shrink-0', active ? 'text-secondary' : 'text-gray-400')}>
            {icon}
          </span>
        )}
        <span className="truncate">{title}</span>
      </div>
      {rightIcon && (
        <span className={cn('h-3.5 w-3.5 shrink-0 flex items-center justify-center', active ? 'text-secondary' : 'text-gray-400')}>
          {rightIcon}
        </span>
      )}
    </>
  );

  if (path) {
    return (
      <Link to={path} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {content}
    </button>
  );
};
