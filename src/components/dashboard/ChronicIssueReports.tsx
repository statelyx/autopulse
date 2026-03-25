/**
 * AUTO PULSE — ChronicIssueReports Component
 * Chronic issue reports with severity indicators
 * From stitch/stitch/auto_pulse_dashboard/code.html
 */

const issues = [
  {
    id: 1,
    icon: 'warning',
    iconColor: 'text-error',
    badge: 'Critical',
    badgeColor: 'bg-error-container/20 text-error',
    title: 'V8 Cooling Manifold Fatigue',
    description: 'Systemic failure detected in sealant gaskets for 4.4L Twin-Turbo powerplants. Probability: 42% at 60k miles.',
    reference: 'NHTSA Ref: 22V-890',
    action: 'Report Meta',
    borderColor: 'border-error',
  },
  {
    id: 2,
    icon: 'info',
    iconColor: 'text-primary',
    badge: 'Observation',
    badgeColor: 'bg-primary-container/10 text-primary-container',
    title: 'HV Battery Cell Balancing',
    description: 'OTA Update 2.4.1 mitigation strategies for high-voltage architecture. Degradation curves stabilizing.',
    reference: 'Telemetry Log #492',
    action: 'Log Details',
    borderColor: 'border-primary-container',
  },
  {
    id: 3,
    icon: 'check_circle',
    iconColor: 'text-secondary-container',
    badge: 'Resolved',
    badgeColor: 'bg-secondary-container/10 text-secondary-container',
    title: 'Infotainment Kernel Panic',
    description: 'Resolution confirmed via fleet-wide patch for Linux-based cockpit systems. Crash frequency down 98%.',
    reference: 'Patch Status: Green',
    action: 'Release Notes',
    borderColor: 'border-secondary-container',
  },
];

export function ChronicIssueReports() {
  return (
    <div className="mt-24">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="font-headline text-2xl font-bold uppercase tracking-tighter">
          Chronic Issue Reports
        </h2>
        <div className="h-[1px] flex-grow bg-outline-variant/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className={`p-8 bg-surface-container rounded-2xl border-l-4 ${issue.borderColor} shadow-lg`}
          >
            <div className="flex justify-between items-start mb-6">
              <span className={`material-symbols-outlined ${issue.iconColor}`} data-icon={issue.icon}>
                {issue.icon}
              </span>
              <span className={`px-2 py-1 ${issue.badgeColor} text-[10px] font-bold uppercase tracking-widest rounded`}>
                {issue.badge}
              </span>
            </div>

            <h4 className="font-headline text-sm font-bold uppercase mb-2">{issue.title}</h4>
            <p className="text-on-surface-variant text-xs mb-6 font-body leading-relaxed">
              {issue.description}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
                {issue.reference}
              </span>
              <button className="text-on-surface text-xs font-bold hover:text-primary underline transition-colors">
                {issue.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
