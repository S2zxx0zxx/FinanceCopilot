import csvParser from 'csv-parser';
import { Readable } from 'node:stream';
import { MoneyNormalizer } from '../../normalization/amount/money.normalizer.js';

export class CSVParser {
    async parseRawStatement(buffer) {
        if (!Buffer.isBuffer(buffer) || buffer.length > 10 * 1024 * 1024) throw new Error('CSV exceeds the 10 MB limit');
        const results = [];
        const parser = Readable.from([buffer]).pipe(csvParser({
            mapHeaders: ({ header }) => header.replace(/^\uFEFF/, '').trim().toLowerCase(),
            strict: true, maxRowBytes: 64 * 1024,
        }));
        let index = 0;
        for await (const row of parser) {
            if (++index > 50000) { parser.destroy(); throw new Error('CSV exceeds the 50,000 row limit'); }
            const keys=Object.keys(row);
            const get=(pattern)=>row[keys.find(k=>pattern.test(k))] ?? null;
            const debit=get(/debit|withdrawal/), credit=get(/credit|deposit/);
            const d=MoneyNormalizer.normalizeToPaise(debit), c=MoneyNormalizer.normalizeToPaise(credit);
            if ((debit?.trim() && !d.is_valid) || (credit?.trim() && !c.is_valid)) throw new Error(`Row ${index}: invalid debit or credit amount`);
            let amount=null, direction=null;
            if (d.is_valid && d.amount_paise>0 && c.is_valid && c.amount_paise>0) throw new Error(`Row ${index}: both debit and credit are nonzero`);
            if (d.is_valid && d.amount_paise>0) { amount=debit; direction='debit'; }
            else if (c.is_valid && c.amount_paise>0) { amount=credit; direction='credit'; }
            else {
                const amountKey=keys.find(k=>/amount/.test(k)&&!/debit|credit|withdrawal|deposit|balance/.test(k));
                amount=amountKey ? row[amountKey] : debit ?? credit;
                const explicit=String(get(/^(direction|type|dr\/cr|debit\/credit)$/) ?? '').trim().toLowerCase();
                if (['debit','dr','withdrawal'].includes(explicit)) direction='debit';
                if (['credit','cr','deposit'].includes(explicit)) direction='credit';
            }
            const date=get(/date/), description=get(/description|narration|particulars/);
            if (!date || !description || !MoneyNormalizer.normalizeToPaise(amount).is_valid) throw new Error(`Row ${index}: date, description and valid amount are required`);
            results.push({ raw_date_text:date, raw_description_text:description, raw_amount_text:amount,
                raw_direction_text:direction, raw_reference_text:get(/reference|ref no|utr/), row_number:index,
                parser_used:'csv_parser', parser_version:'2.0.0', extraction_confidence:1 });
        }
        if (!results.length) throw new Error('CSV contains no transactions');
        return results;
    }
}
