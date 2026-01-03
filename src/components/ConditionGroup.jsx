import { memo, useRef, useEffect  } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * ConditionGroup Component
 * Collapsible section for grouping rating cards by body system
 * Now controlled by parent for accordion behavior
 */
const ConditionGroup = memo(({
                               title,
                               icon,
                               children,
                               conditionCount = 0,
                               accentColor = 'blue',
                               isExpanded = false,
                               onToggle,
                               groupId
                             }) => {


  // Ref for scrolling into view when expanded
  const groupRef = useRef(null);

  // Scroll into view when this group becomes expanded
  useEffect(() => {
    if (isExpanded && groupRef.current) {
      // Small delay to allow the DOM to update after previous group closes
      setTimeout(() => {
        groupRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [isExpanded]);

  // Don't render if no conditions have data
  if (conditionCount === 0) return null;

  // Map accent colors to group class names for CSS targeting
  const groupClassMap = {
    amber: 'group-musculoskeletal',
    cyan: 'group-respiratory',
    blue: 'group-eye-ear',
    green: 'group-infectious',
    red: 'group-cardiovascular',
    lime: 'group-digestive',
    orange: 'group-genitourinary',
    rose: 'group-hemic',
    pink: 'group-skin',
    teal: 'group-endocrine',
    indigo: 'group-neurological',
    purple: 'group-mental-health',
    yellow: 'group-dental',
  };

  const groupClass = groupClassMap[accentColor] || 'group-other';

  const colorClasses = {
    blue: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
    purple: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
    red: 'border-red-500 bg-red-50 dark:bg-red-900/20',
    green: 'border-green-500 bg-green-50 dark:bg-green-900/20',
    amber: 'border-amber-500 bg-amber-50 dark:bg-amber-900/20',
    teal: 'border-teal-500 bg-teal-50 dark:bg-teal-900/20',
    pink: 'border-pink-500 bg-pink-50 dark:bg-pink-900/20',
    indigo: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20',
    orange: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20',
    cyan: 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20',
    lime: 'border-lime-500 bg-lime-50 dark:bg-lime-900/20',
    rose: 'border-rose-500 bg-rose-50 dark:bg-rose-900/20',
    yellow: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  };

  const badgeColors = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    teal: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    cyan: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    lime: 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200',
    rose: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  };

  return (
      <div ref={groupRef} className={`mb-4 ${groupClass}`}>
        {/* Group Header */}
        <button
            onClick={() => onToggle(groupId)}
            className={`w-full flex items-center justify-between p-3 rounded-lg border-l-4 ${colorClasses[accentColor]} 
                   hover:opacity-90 transition-all duration-200`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {conditionCount} condition{conditionCount !== 1 ? 's' : ''} with logged data
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${badgeColors[accentColor]}`}>
            {conditionCount}
          </span>
            {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </button>

        {/* Group Content */}
        {isExpanded && (
            <div className="mt-2 space-y-3 pl-2 border-l-2 border-gray-200 dark:border-gray-700 ml-4">
              {children}
            </div>
        )}
      </div>
  );
});

ConditionGroup.displayName = 'ConditionGroup';

export default ConditionGroup;