export default function MarkEntryRow({ student, maxMarks, value, onChange, disabled }) {
  const { marks, isAbsent, remarks } = value;

  const handleAbsent = (e) => {
    onChange({ ...value, isAbsent: e.target.checked, marks: e.target.checked ? '' : marks });
  };

  const handleMarks = (e) => {
    const v = e.target.value;
    if (v === '') { onChange({ ...value, marks: '' }); return; }
    const num = parseFloat(v);
    if (isNaN(num)) return;
    if (num < 0) return;
    onChange({ ...value, marks: num });
  };

  const marksNum = parseFloat(marks);
  const isOver = !isNaN(marksNum) && marksNum > maxMarks;

  return (
    <>
      {/* Roll No */}
      <td className="px-4 py-3 text-[11px] font-bold text-slate-500">
        {student.rollNumber || '—'}
      </td>

      {/* Name */}
      <td className="px-4 py-3">
        <div className="text-sm font-bold text-slate-800">
          {[student.firstName, student.lastName].filter(Boolean).join(' ') || student.name}
        </div>
      </td>

      {/* Absent */}
      <td className="px-4 py-3 text-center">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isAbsent}
            onChange={handleAbsent}
            disabled={disabled}
          />
          <div className={`w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:bg-rose-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} />
        </label>
      </td>

      {/* Marks */}
      <td className="px-4 py-3">
        <div className="relative">
          <input
            type="number"
            min={0}
            max={maxMarks}
            step="0.5"
            value={isAbsent ? '' : marks}
            onChange={handleMarks}
            disabled={isAbsent || disabled}
            placeholder={isAbsent ? 'AB' : `0–${maxMarks}`}
            className={`w-28 h-9 px-3 rounded-md border text-sm font-semibold text-center transition-all focus:outline-none focus:ring-2
              ${isAbsent || disabled
                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                : isOver
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50 text-rose-600'
                  : 'border-slate-200 focus:border-primary focus:ring-primary/10 bg-white text-slate-800'
              }`}
          />
          {isOver && (
            <p className="absolute left-0 top-full mt-0.5 text-[9px] font-bold text-rose-500 whitespace-nowrap">
              Max {maxMarks}
            </p>
          )}
        </div>
      </td>

      {/* Remarks */}
      <td className="px-4 py-3">
        <input
          type="text"
          value={remarks}
          onChange={e => onChange({ ...value, remarks: e.target.value })}
          placeholder={disabled ? '' : "Optional note"}
          disabled={disabled}
          className={`w-full h-9 px-3 rounded-md border border-slate-200 text-[11px] font-medium text-slate-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white transition-all ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-100' : ''}`}
        />
      </td>

      {/* Status indicator */}
      <td className="px-4 py-3 text-center">
        {isAbsent ? (
          <span className="px-2 py-0.5 text-[9px] font-bold bg-rose-50 text-rose-500 rounded-md border border-rose-100">AB</span>
        ) : marks !== '' && !isOver ? (
          <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100">✓</span>
        ) : (
          <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-50 text-slate-400 rounded-md border border-slate-100">—</span>
        )}
      </td>
    </>
  );
}
