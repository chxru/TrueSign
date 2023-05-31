import jsPDF from 'jspdf';
import QRCode from 'qrcode';

const MAX_COLS = 7;
const MAX_ROWS_FIRST_PAGE = 8;
const MAX_ROWS_OTHER_PAGES = 8;

const BOX_WIDTH = 25;
const BOX_HEIGHT = 20;
const BOX_H_SPACING = 4;
const BOX_V_SPACING = 12;
const BOX_TEXT_V_SPACING = 5;

const TEXT_H_OFFSET = 2;

const PAGE_MARGIN_LEFT = 5;
const PAGE_MARGIN_TOP_FIRST_PAGE = 30;
const PAGE_MARGIN_TOP_OTHER_PAGES = 20;

const generateQRCode = async (moduleId: string, pageNo: number) => {
  try {
    const code = await QRCode.toDataURL(`${moduleId}-${pageNo}`, {
      errorCorrectionLevel: 'H',
    });
    return code;
  } catch (error) {
    console.error(error);
  }
};

const mainPage = async (
  doc: jsPDF,
  moduleName: string,
  moduleId: string,
  students: string[]
) => {
  const code = await generateQRCode(moduleId, 1);
  doc.addImage(code, 'png', 180, 10, 10, 10, 'QR Code');

  doc.setFontSize(14);
  doc.text(`Module Name: ${moduleName}`, 10, 10);

  doc.setFontSize(11);
  doc.text(`Module ID: ${moduleId}`, 10, 15);

  const rows = Math.ceil(students.length / MAX_COLS);
  const lastRowColumns = students.length % MAX_COLS || MAX_COLS;

  // reduce font size for student ids
  doc.setFontSize(8);

  for (let i = 0; i < rows; i++) {
    const cols = i === rows - 1 ? lastRowColumns : MAX_COLS;

    for (let j = 0; j < cols; j++) {
      const student = students[i * MAX_COLS + j];

      doc.rect(
        PAGE_MARGIN_LEFT + (BOX_WIDTH + BOX_H_SPACING) * j,
        PAGE_MARGIN_TOP_FIRST_PAGE + (BOX_HEIGHT + BOX_V_SPACING) * i,
        BOX_WIDTH,
        BOX_HEIGHT
      );

      doc.text(
        student,
        PAGE_MARGIN_LEFT + TEXT_H_OFFSET + (BOX_WIDTH + BOX_H_SPACING) * j,
        PAGE_MARGIN_TOP_FIRST_PAGE +
          (BOX_HEIGHT + BOX_V_SPACING) * i +
          BOX_HEIGHT +
          TEXT_H_OFFSET +
          BOX_TEXT_V_SPACING
      );
    }
  }
};

const otherPage = async (doc: jsPDF, moduleId: string, students: string[]) => {
  const code = await generateQRCode(moduleId, 1);
  doc.addImage(code, 'png', 180, 10, 10, 10, 'QR Code');

  const rows = Math.ceil(students.length / MAX_COLS);
  const lastRowColumns = students.length % MAX_COLS || MAX_COLS;

  for (let i = 0; i < rows; i++) {
    const cols = i === rows - 1 ? lastRowColumns : MAX_COLS;

    for (let j = 0; j < cols; j++) {
      const student = students[i * MAX_COLS + j];

      doc.rect(
        PAGE_MARGIN_LEFT + (BOX_WIDTH + BOX_H_SPACING) * j,
        PAGE_MARGIN_TOP_OTHER_PAGES + (BOX_HEIGHT + BOX_V_SPACING) * i,
        BOX_WIDTH,
        BOX_HEIGHT
      );

      doc.text(
        student,
        PAGE_MARGIN_LEFT + TEXT_H_OFFSET + (BOX_WIDTH + BOX_H_SPACING) * j,
        PAGE_MARGIN_TOP_OTHER_PAGES +
          (BOX_HEIGHT + BOX_V_SPACING) * i +
          BOX_HEIGHT +
          TEXT_H_OFFSET +
          BOX_TEXT_V_SPACING
      );
    }
  }
};

export const GenerateAttendanceSheet = async (
  moduleName: string,
  moduleId: string,
  students: string[]
) => {
  const doc = new jsPDF();

  // set rectangle border
  doc.setDrawColor(0, 0, 0);

  await mainPage(
    doc,
    moduleName,
    moduleId,
    students.splice(0, MAX_ROWS_FIRST_PAGE * MAX_COLS)
  );

  // handle other pages
  while (students.length > 0) {
    doc.addPage();
    await otherPage(
      doc,
      moduleId,
      students.splice(0, MAX_ROWS_OTHER_PAGES * MAX_COLS)
    );
  }

  doc.save(`${moduleName}.pdf`);
};
