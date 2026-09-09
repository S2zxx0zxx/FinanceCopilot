import { PDFDocument } from 'pdfkit';
import { dbClient } from '../db/client.js';

const MAX_BYTES = 20 * 1024 * 1024;
const TABLES = ['financial_accounts','transactions','goals','budgets','recurring_series','ai_insights'];
const cell = value => {
  const text = typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');
  return `"${(/^[\s]*[=+@-]/.test(text) ? "'" + text : text).replaceAll('"','""')}"`;
};

export async function encodeExport(snapshot, format) {
  if (format === 'json') return { content: Buffer.from(JSON.stringify(snapshot,null,2)), mime: 'application/json' };
  if (format === 'csv') {
    const lines = ['section,record_json'];
    for (const [section,records] of Object.entries(snapshot.records)) {
      for (const record of records) lines.push(`${cell(section)},${cell(record)}`);
    }
    return { content: Buffer.from('\uFEFF'+lines.join('\r\n')), mime: 'text/csv; charset=utf-8' };
  }
  if (format !== 'pdf') throw new Error('Unsupported export format');
  // Summary uses only fixed labels/numbers; full Unicode records remain in JSON/CSV.
  const doc = new PDFDocument({ size:'A4', margin:48, info:{Title:'FinanceCopilot record summary'} });
  const output = new Promise((resolve,reject)=>{
    const chunks=[]; let bytes=0;
    doc.on('data',chunk=>{ bytes+=chunk.length; if(bytes>MAX_BYTES) doc.destroy(new Error('Export exceeds size limit')); else chunks.push(chunk); });
    doc.on('error',reject); doc.on('end',()=>resolve(Buffer.concat(chunks)));
  });
  doc.fontSize(24).fillColor('#104d40').text('Your financial records');
  doc.moveDown().fontSize(10).fillColor('#333333').text(`Prepared: ${snapshot.generated_at}`);
  doc.moveDown().text('This PDF is an inventory summary. Download JSON or CSV for complete record fields.');
  for (const [section,records] of Object.entries(snapshot.records)) doc.moveDown().fontSize(12).text(`${section.replaceAll('_',' ')}: ${records.length} retained records`);
  doc.moveDown(2).fontSize(10).text('Counts include retained records, including review and archived states. They do not represent available bank balances.');
  doc.end();
  return { content: await output, mime:'application/pdf' };
}

export class ExportWorker {
  startPolling(interval=5000) {
    if(this.timer)return;
    this.timer=setInterval(async()=>{if(this.running)return;this.running=true;try{await this.pollOnce();}catch{console.error('[EXPORT] Processing unavailable; recoverable jobs will retry.');}finally{this.running=false;}},interval);
  }
  async pollOnce() {
    await dbClient.query("DELETE FROM export_artifacts WHERE job_id IN (SELECT job_id FROM export_jobs WHERE expires_at<NOW())");
    await dbClient.query("UPDATE export_jobs SET status='EXPIRED',download_url=NULL WHERE status='COMPLETED' AND expires_at<NOW()");
    await dbClient.query("UPDATE export_jobs SET status='FAILED',error_message='Export could not finish after three attempts.',lease_token=NULL WHERE status='PROCESSING' AND attempt>=3 AND lease_expires_at<NOW()");
    const claimed=await dbClient.query(`UPDATE export_jobs SET attempt=attempt+1,lease_token=gen_random_uuid(),lease_expires_at=NOW()+INTERVAL '5 minutes'
      WHERE job_id=(SELECT job_id FROM export_jobs WHERE status='PROCESSING' AND attempt<3
        AND (lease_expires_at IS NULL OR lease_expires_at<NOW()) ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1) RETURNING *`);
    const job=claimed.rows[0];if(!job)return;
    const client=await dbClient.connect();
    try {
      await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ');
      await client.query("SET LOCAL statement_timeout='30s'");
      const user=await client.query('SELECT user_id FROM users WHERE user_id=$1 AND is_deleted=false',[job.user_id]);
      if(!user.rows.length)throw new Error('Account unavailable');
      const snapshot={version:1,generated_at:new Date().toISOString(),records:{}};
      let bytes=0;
      for(const table of TABLES){
        // Identifiers come exclusively from the constant allowlist above.
        const result=await client.query(`SELECT * FROM ${table} WHERE user_id=$1 LIMIT 10001`,[job.user_id]);
        if(result.rows.length>10000)throw new Error('Export exceeds record limit');
        snapshot.records[table]=result.rows.map(({user_id,...record})=>Object.fromEntries(
          Object.entries(record).map(([key,value])=>[key,key.endsWith('_paise') && value !== null ? String(value) : value])
        ));
        bytes+=Buffer.byteLength(JSON.stringify(snapshot.records[table]));
        if(bytes>MAX_BYTES)throw new Error('Export exceeds size limit');
      }
      await client.query('COMMIT');
      const artifact=await encodeExport(snapshot,job.format);
      if(artifact.content.length>MAX_BYTES)throw new Error('Export exceeds size limit');
      await client.query('BEGIN');
      const valid=await client.query(`SELECT j.job_id FROM export_jobs j JOIN users u ON u.user_id=j.user_id
        WHERE j.job_id=$1 AND j.lease_token=$2 AND j.status='PROCESSING' AND j.lease_expires_at>NOW() AND u.is_deleted=false FOR UPDATE OF j,u`,[job.job_id,job.lease_token]);
      if(!valid.rows.length)throw new Error('Export lease expired');
      await client.query('INSERT INTO export_artifacts(job_id,content,mime_type) VALUES($1,$2,$3)',[job.job_id,artifact.content,artifact.mime]);
      await client.query("UPDATE export_jobs SET status='COMPLETED',download_url=$3,expires_at=NOW()+INTERVAL '24 hours',lease_token=NULL,lease_expires_at=NULL,updated_at=NOW() WHERE job_id=$1 AND lease_token=$2",[job.job_id,job.lease_token,`/api/v1/trust/export/${job.job_id}/download`]);
      await client.query('COMMIT');
    } catch(error) {
      await client.query('ROLLBACK');
      const bounded=['Export exceeds record limit','Export exceeds size limit','Unsupported export format','Account unavailable'].includes(error.message);
      await dbClient.query(`UPDATE export_jobs SET status=CASE WHEN $3 OR attempt>=3 THEN 'FAILED' ELSE 'PROCESSING' END,
        error_message=$4,lease_expires_at=NOW()+INTERVAL '30 seconds',updated_at=NOW() WHERE job_id=$1 AND lease_token=$2`,
        [job.job_id,job.lease_token,bounded,bounded?error.message:'Export processing interrupted. It will retry automatically.']);
    } finally {client.release();}
  }
}
