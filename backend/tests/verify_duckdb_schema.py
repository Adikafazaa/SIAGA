import duckdb

conn = duckdb.connect('data/siaga_sessions.duckdb', read_only=True)
tables = conn.execute('SHOW TABLES').fetchall()
print('Tables in DuckDB:', tables)
columns = conn.execute('DESCRIBE turns').fetchall()
col_names = [c[0] for c in columns]
print('Columns in turns table:', col_names)
has_plaintext = any('text' in col.lower() and col.lower() != 'text_hash' for col in col_names)
print('Has plaintext column:', has_plaintext)
rows = conn.execute('SELECT COUNT(*) FROM turns').fetchone()
print('Total turns recorded:', rows[0])
sample = conn.execute('SELECT session_id, turn, text_hash, momentum, decision FROM turns LIMIT 3').fetchall()
for s in sample:
    print('Sample turn (SHA-256 hash only):', s)
