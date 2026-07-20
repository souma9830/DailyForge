import ExcelJS from 'exceljs';

/**
 * Generates and downloads a multi-sheet Excel (.xlsx) report containing Study Logs, Daily Tasks, and Habits.
 * @param {Array} studySessions 
 * @param {Array} tasks 
 * @param {Array} habits 
 */
export async function exportDailyForgeExcel(studySessions = [], tasks = [], habits = []) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'DailyForge Productivity App';
  workbook.created = new Date();

  // Helper for applying header formatting
  const styleHeaderRow = (row) => {
    row.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    row.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E2638' }, // Dark slate blue
    };
    row.alignment = { vertical: 'middle', horizontal: 'center' };
    row.height = 24;
  };

  // Helper for applying cell borders
  const styleDataRows = (worksheet) => {
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header
      row.font = { name: 'Segoe UI', size: 10 };
      row.alignment = { vertical: 'middle', horizontal: 'left' };
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        };
      });
    });
  };

  // -------------------------------------------------------------
  // WORKSHEET 1: Study Logs
  // -------------------------------------------------------------
  const studySheet = workbook.addWorksheet('Study Logs');
  studySheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Subject', key: 'subject', width: 22 },
    { header: 'Topic', key: 'topic', width: 28 },
    { header: 'Duration (Mins)', key: 'duration', width: 16 },
    { header: 'Difficulty', key: 'difficulty', width: 14 },
    { header: 'Notes', key: 'notes', width: 35 },
  ];
  styleHeaderRow(studySheet.getRow(1));

  studySessions.forEach((s) => {
    studySheet.addRow({
      date: s.date || (s.createdAt ? new Date(s.createdAt).toISOString().split('T')[0] : ''),
      subject: s.subject || '',
      topic: s.topic || '',
      duration: Number(s.durationMinutes) || 0,
      difficulty: s.difficulty || 'Medium',
      notes: s.notes || '',
    });
  });
  styleDataRows(studySheet);

  // -------------------------------------------------------------
  // WORKSHEET 2: Daily Tasks
  // -------------------------------------------------------------
  const taskSheet = workbook.addWorksheet('Daily Tasks');
  taskSheet.columns = [
    { header: 'Task Title', key: 'title', width: 32 },
    { header: 'Category', key: 'category', width: 18 },
    { header: 'Priority', key: 'priority', width: 14 },
    { header: 'Status', key: 'status', width: 16 },
    { header: 'Created At', key: 'createdAt', width: 18 },
  ];
  styleHeaderRow(taskSheet.getRow(1));

  tasks.forEach((t) => {
    taskSheet.addRow({
      title: t.title || '',
      category: t.category || 'General',
      priority: t.priority || 'medium',
      status: t.status === 'completed' ? 'Completed ✅' : 'Pending ⏳',
      createdAt: t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : '',
    });
  });
  styleDataRows(taskSheet);

  // -------------------------------------------------------------
  // WORKSHEET 3: Habits Tracker
  // -------------------------------------------------------------
  const habitSheet = workbook.addWorksheet('Habits Tracker');
  habitSheet.columns = [
    { header: 'Habit Name', key: 'title', width: 28 },
    { header: 'Category', key: 'category', width: 18 },
    { header: 'Frequency', key: 'frequency', width: 14 },
    { header: 'Current Streak', key: 'currentStreak', width: 16 },
    { header: 'Best Streak', key: 'bestStreak', width: 14 },
    { header: 'Total Check-ins', key: 'totalCompletions', width: 18 },
  ];
  styleHeaderRow(habitSheet.getRow(1));

  habits.forEach((h) => {
    habitSheet.addRow({
      title: h.title || '',
      category: h.category || 'General',
      frequency: h.frequency || 'Daily',
      currentStreak: h.currentStreak || 0,
      bestStreak: h.bestStreak || 0,
      totalCompletions: Array.isArray(h.completedDates) ? h.completedDates.length : 0,
    });
  });
  styleDataRows(habitSheet);

  // -------------------------------------------------------------
  // Write to Buffer & Trigger Browser Download
  // -------------------------------------------------------------
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const todayStr = new Date().toISOString().split('T')[0];
  anchor.href = url;
  anchor.download = `DailyForge_Export_${todayStr}.xlsx`;
  anchor.click();
  window.URL.revokeObjectURL(url);
}
