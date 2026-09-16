import { useTilt } from '../lib/useTilt'

// Wraps any element in a 3D-tilting surface with a moving light sheen.
export default function Tilt({ as: Tag = 'div', className = '', max = 12, scale = 1.03, children, ...rest }) {
  const ref = useTilt({ max, scale })
  return (
    <Tag ref={ref} className={`tilt ${className}`} {...rest}>
      <div className="tilt-inner">
        {children}
        <span className="sheen" aria-hidden="true" />
      </div>
    </Tag>
  )
}
