import { useDepth } from '../lib/use3d'

// A section that travels forward out of depth as it scrolls into view.
export default function Depth({ as: Tag = 'section', className = '', children, ...rest }) {
  const ref = useDepth()
  return (
    <Tag ref={ref} className={`depth ${className}`} {...rest}>
      <div className="depth-inner">{children}</div>
    </Tag>
  )
}
