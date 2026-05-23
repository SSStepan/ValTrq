interface Props {
  src: string;
  name: string;
  size?: number;
  className?: string;
}

export default function AgentIcon({ src, name, size = 48, className = '' }: Props) {
  return (
    <img
      src={src}
      alt={name}
      style={{ width: size, height: size }}
      className={`object-cover bg-bg-tertiary ${className}`}
      onError={e => ((e.target as HTMLImageElement).style.opacity = '0.3')}
    />
  );
}
