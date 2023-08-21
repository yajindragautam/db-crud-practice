"user strict";

import ExcelJS from "exceljs";

export const createExcel = async (tsData,res) => {
  try {
    // Create a workbook
    const workbook = new ExcelJS.Workbook();
    //create a worksheet
    const sheet = workbook.addWorksheet("translations", {
      properties: { tabColor: { argb: "FFC0000" } },
      headerFooter: {
        firstHeader: "Translations Header",
        firstFooter: "Translations Footer",
      },
    });
    // add column
    sheet.columns = [
      { header: "Id", key: "id", width: 20, style: { font: { name: 'Arial Black' } } },
      { header: "Translationcodeid", key: "translationcodeid", width: 32, style: { font: { name: 'Arial Black' } } },
      {
        header: "Languagetext",
        key: "languagetext",
        width: 20,
        style: { font: { name: 'Arial Black' } }
      },
      { header: "Locale Id", key: "localeid", width: 32, style: { font: { name: 'Arial Black' } } },
    ];
    sheet.views = [
        {state: 'frozen', topLeftCell: 'G10', activeCell: 'A1'}
      ];

    // add row
    tsData.forEach((item: any) => {
      sheet.addRow({
        id: item.id,
        translationcodeid: item.translationcodeid,
        languagetext: item.languagetext,
        localeid: item.localeid,
      });
    });

    // add sheet protection
    await sheet.protect('the-password',{
        formatColumns: true, // Allow formatting columns (optional)
        formatRows: true, // Allow formatting rows (optional)
    });


    // sheet.commit();

    // Send excel response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "Report.xlsx"
    );
    // Serialize the workbook to a buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (err) {
    console.log(err);
  }
};
