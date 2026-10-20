import ExcelJS from 'exceljs';
import path from 'path';

export interface TestCaseRow {
  testCaseId: string;
  module: string;
  testScenario: string;
  testSteps: string;
  testData: string;
  expectedResult: string;
  executeFlag: string;
}

export async function readTestCases(fileName: string): Promise<TestCaseRow[]> {
  const workbook = new ExcelJS.Workbook();
  const filePath = path.resolve(__dirname, `../testdata/${fileName}`);
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.worksheets[0];
  const rows: TestCaseRow[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header

    const [, testCaseId, module, testScenario, testSteps, testData, expectedResult, executeFlag] =
      row.values as string[];

    if (String(executeFlag).toUpperCase() === 'Y') {
      rows.push({ testCaseId, module, testScenario, testSteps, testData, expectedResult, executeFlag });
    }
  });

  return rows;
}

export async function readSheet<T extends Record<string, string>>(
  fileName: string,
  sheetName: string
): Promise<T[]> {
  const workbook = new ExcelJS.Workbook();
  const filePath = path.resolve(__dirname, `../testdata/${fileName}`);
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet(sheetName);
  if (!worksheet) throw new Error(`Sheet "${sheetName}" not found in ${fileName}`);

  const headers: string[] = [];
  const rows: T[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      (row.values as string[]).forEach((v, i) => { if (i > 0) headers[i] = String(v); });
      return;
    }
    const obj: Record<string, string> = {};
    (row.values as string[]).forEach((v, i) => {
      if (i > 0 && headers[i]) obj[headers[i]] = String(v ?? '');
    });
    rows.push(obj as T);
  });

  return rows;
}
