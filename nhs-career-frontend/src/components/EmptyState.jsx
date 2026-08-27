export default function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center">
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-nhs-blue/10 text-nhs-blue">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="text-base font-semibold text-nhs-dark-grey">{title}</h3>
      {children && <p className="mt-1.5 max-w-sm text-sm text-nhs-mid-grey">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
