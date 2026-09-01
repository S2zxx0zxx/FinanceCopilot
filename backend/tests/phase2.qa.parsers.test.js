import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CSVParser } from '../domains/ingestion/parsers/csv.parser.js';
import { ExcelParser } from '../domains/ingestion/parsers/excel.parser.js';

describe('PHASE 2 EXIT GATE - PARSER QA MATRIX', () => {

    it('1. MUST PASS: CSV Parser handles malformed row by ignoring it safely without crashing', async () => {
        const parser = new CSVParser();
        
        // Mock a CSV where Row 1 is normal, Row 2 is totally malformed/missing columns, Row 3 is normal
        const mockCsvBuffer = Buffer.from(
            "date,description,amount\n" +
            "2023-01-01,AMAZON,50.00\n" +
            ",,,\n" + // Blank/malformed row
            "2023-01-02,STARBUCKS,10.00\n"
        );

        const records = await parser.parseRawStatement(mockCsvBuffer);
        
        assert.strictEqual(records.length, 2, 'Should have extracted exactly 2 valid rows');
        
        // Provenance checks: csv-parser counts data rows sequentially
        assert.strictEqual(records[0].row_number, 1, 'First valid data row is at index 1');
        assert.strictEqual(records[1].row_number, 2, 'Second valid data row is at index 2');
        
        assert.strictEqual(records[0].raw_amount_text, '50.00');
        assert.strictEqual(records[1].raw_amount_text, '10.00');
    });

    it('2. MUST PASS: CSV Parser handles missing header rows gracefully', async () => {
        const parser = new CSVParser();
        
        // If there are no recognizable headers, the heuristic mapping should return empty array,
        // but it MUST NOT crash the worker.
        const mockCsvBuffer = Buffer.from(
            "col1,col2,col3\n" +
            "foo,bar,baz\n"
        );

        const records = await parser.parseRawStatement(mockCsvBuffer);
        
        assert.strictEqual(records.length, 0, 'Should not extract any rows if it cannot recognize headers');
    });

    it('3. MUST PASS: Excel Parser handles empty file gracefully', async () => {
        const parser = new ExcelParser();
        
        // Let's test the heuristic failure directly since we don't have a real xlsx buffer here
        // We will call the private method _findHeaders directly to test its edge cases
        const headersResult = parser._findHeaders([]);
        assert.strictEqual(headersResult.headerRowIndex, -1);
        
        const headersResult2 = parser._findHeaders([["random", "row"]]);
        assert.strictEqual(headersResult2.headerRowIndex, -1);
    });
});
