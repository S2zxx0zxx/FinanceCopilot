import * as xlsx from 'xlsx';

/**
 * Excel Parser
 * Deterministically extracts raw rows from Excel (.xls, .xlsx) files.
 */
export class ExcelParser {
    
    /**
     * Parses an Excel file buffer and returns raw extracted records.
     * @param {Buffer} fileBuffer 
     */
    async parseRawStatement(fileBuffer) {
        return new Promise((resolve, reject) => {
            try {
                const results = [];
                const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
                
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1, raw: false });

                const { headerRowIndex, headers } = this._findHeaders(rows);

                if (headerRowIndex === -1) {
                    return resolve([]); // Could not find a header row reliably
                }

                for (let i = headerRowIndex + 1; i < rows.length; i++) {
                    const row = rows[i];
                    if (!row || row.length === 0) continue;

                    const rowData = this._mapRowToHeaders(row, headers);
                    const extracted = this._extractRecord(rowData);

                    if (extracted.rawDate && extracted.rawDesc) {
                        results.push({
                            raw_date_text: extracted.rawDate,
                            raw_description_text: extracted.rawDesc,
                            raw_reference_text: extracted.rawRef,
                            raw_amount_text: extracted.rawAmount,
                            raw_direction_text: extracted.rawDirection,
                            row_number: i + 1,
                            parser_used: 'excel_parser',
                            parser_version: '1.0.0',
                            extraction_confidence: 1.000
                        });
                    }
                }

                resolve(results);
            } catch (error) {
                console.error('[EXCEL_PARSER] Failed to parse Excel file:', error);
                reject(error);
            }
        });
    }

    _findHeaders(rows) {
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length === 0) continue;
            
            const rowText = row.join(' ').toLowerCase();
            if (rowText.includes('date') && (rowText.includes('description') || rowText.includes('particulars') || rowText.includes('narration'))) {
                return {
                    headerRowIndex: i,
                    headers: row.map(h => (h ? h.toString().trim().toLowerCase() : ''))
                };
            }
        }
        return { headerRowIndex: -1, headers: [] };
    }

    _mapRowToHeaders(row, headers) {
        const rowData = {};
        for (let j = 0; j < headers.length; j++) {
            if (headers[j]) {
                rowData[headers[j]] = row[j] || null;
            }
        }
        return rowData;
    }

    _extractRecord(rowData) {
        const dateCol = Object.keys(rowData).find(k => k.includes('date'));
        const descCol = Object.keys(rowData).find(k => k.includes('description') || k.includes('narration') || k.includes('particulars'));
        const amtCol = Object.keys(rowData).find(k => k.includes('amount'));
        const debitCol = Object.keys(rowData).find(k => k.includes('debit') || k.includes('withdrawal'));
        const creditCol = Object.keys(rowData).find(k => k.includes('credit') || k.includes('deposit'));
        const refCol = Object.keys(rowData).find(k => k.includes('ref') || k.includes('chq'));

        const rawDate = dateCol ? rowData[dateCol] : null;
        const rawDesc = descCol ? rowData[descCol] : null;
        const rawRef = refCol ? rowData[refCol] : null;
        
        let rawAmount = null;
        let rawDirection = null;

        if (amtCol) {
            rawAmount = rowData[amtCol];
        } else if (debitCol && rowData[debitCol]) {
            rawAmount = rowData[debitCol];
            rawDirection = 'debit';
        } else if (creditCol && rowData[creditCol]) {
            rawAmount = rowData[creditCol];
            rawDirection = 'credit';
        }

        return { rawDate, rawDesc, rawRef, rawAmount, rawDirection };
    }
}
